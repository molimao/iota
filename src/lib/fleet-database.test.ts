import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

const user = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const grandfather = "33333333-3333-4333-8333-333333333333";
let db: PGlite;
async function asUser(id: string) {
  await db.exec("RESET ROLE; SET ROLE authenticated;");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function mutate(action: string, payload: object) {
  const result = await db.query<{
    data: {
      devices: { id: string; bindings: { id: string; project: string }[] }[];
      projectDeviceLimit: number;
      projectCounts: Record<string, number>;
    };
  }>("SELECT watch_mutate_device($1,$2::jsonb) AS data", [action, JSON.stringify(payload)]);
  return result.rows[0]!.data;
}
function wallet(n: number) {
  return "0x" + n.toString(16).padStart(40, "0");
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;",
  );
  await db.query("INSERT INTO auth.users(id) VALUES($1),($2),($3)", [user, other, grandfather]);
  await db.exec(
    readFileSync(
      "supabase/migrations/20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
      "utf8",
    ),
  );
  for (let i = 0; i < 8; i++)
    await db.query("INSERT INTO user_devices(user_id,hotkey,label) VALUES($1,$2,$3)", [
      grandfather,
      "5".repeat(46) + String(i + 1),
      "Old device " + i,
    ]);
  await db.exec(readFileSync("supabase/migrations/20261005130000_fleet_and_billing.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261006190000_compute_projects.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261006200000_platform_connections.sql", "utf8"));
}, 30000);
afterAll(async () => {
  await db.close();
});
describe("real PostgreSQL quota and subscription enforcement", () => {
  it("keeps all 8 legacy devices and prohibits anonymous mutations", async () => {
    await asUser(grandfather);
    const result = await db.query<{
      data: { devices: unknown[]; projectCounts: { iota: number } };
    }>("SELECT watch_list_devices() AS data");
    expect(result.rows[0]!.data.devices).toHaveLength(8);
    expect(result.rows[0]!.data.projectCounts.iota).toBe(8);
    await db.exec("RESET ROLE; SET ROLE anon;");
    await expect(mutate("create", { name: "Anonymous" })).rejects.toThrow(/permission denied/);
  });
  it("permits unlimited unlinked overview records; only the sixth project device is blocked", async () => {
    await asUser(user);
    for (let i = 1; i <= 5; i++)
      await mutate("create", {
        name: "Device " + i,
        binding: { project: "flyai", identifier: wallet(i) },
      });
    for (let i = 0; i < 16; i++) await mutate("create", { name: "Unlinked " + i });
    const snapshot = await mutate("create", { name: "Extra" });
    expect(snapshot.devices.length).toBe(22);
    expect(snapshot.projectCounts["flyai"]).toBe(5);
    await expect(
      mutate("create", { name: "Sixth", binding: { project: "flyai", identifier: wallet(6) } }),
    ).rejects.toThrow("project_device_limit_reached");
    const preserved = await db.query<{ count: number }>(
      "SELECT count(*)::integer AS count FROM watch_devices",
    );
    expect(preserved.rows[0]!.count).toBe(22); // Atomic add must not leave an empty card after quota failure.
    const shared = snapshot.devices[0]!;
    const next = await mutate("link", {
      id: shared.id,
      binding: { project: "iota", identifier: "5".repeat(48) },
    });
    expect(next.projectCounts["iota"]).toBe(1);
    await mutate("link", {
      id: shared.id,
      binding: { project: "flyai", identifier: wallet(7), worker: "extra" },
    });
    const after = await db.query<{ data: { projectCounts: { flyai: number } } }>(
      "SELECT watch_list_devices() AS data",
    );
    expect(after.rows[0]!.data.projectCounts.flyai).toBe(5);
  });
  it("prevents direct quota bypass and reads or mutations of another account", async () => {
    const owned = await mutate("create", { name: "Private" });
    await expect(
      db.query("INSERT INTO watch_devices(user_id,name) VALUES($1,'Bypass')", [user]),
    ).rejects.toThrow(/permission denied/);
    await expect(db.query("UPDATE watch_billing SET status='active'")).rejects.toThrow(
      /permission denied/,
    );
    await asUser(other);
    const read = await db.query("SELECT * FROM watch_devices WHERE user_id=$1", [user]);
    expect(read.rows).toHaveLength(0);
    await expect(mutate("rename", { id: owned.devices[0]!.id, name: "Stolen" })).rejects.toThrow(
      "device_not_found",
    );
    await expect(
      db.query("SELECT watch_reserve_checkout($1,'month','cus_test','zh')", [other]),
    ).rejects.toThrow(/permission denied/);
  });
  it("reuses checkout reservation, rejects plan changes while pending and verifies the customer", async () => {
    await db.exec("RESET ROLE; SET ROLE service_role;");
    const query = () =>
      db.query<{ reservation: { token: string; expiresAt: number } }>(
        "SELECT watch_reserve_checkout($1,'month','cus_test','zh') AS reservation",
        [user],
      );
    const first = (await query()).rows[0]!.reservation,
      second = (await query()).rows[0]!.reservation;
    expect(second).toEqual(first);
    await expect(
      db.query("SELECT watch_reserve_checkout($1,'year','cus_test','zh')", [user]),
    ).rejects.toThrow("checkout_pending");
    await expect(
      db.query("SELECT watch_reserve_checkout($1,'month','cus_other','zh')", [user]),
    ).rejects.toThrow("customer_mismatch");
  });
  it("only signed service updates grant Pro; duplicate and old events cannot overwrite it", async () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    await db.query(
      "SELECT watch_sync_subscription('evt_active',200,$1,'cus_test','sub_test','active',$2,true)",
      [user, future],
    );
    await db.query(
      "SELECT watch_sync_subscription('evt_active',300,$1,'cus_test','sub_test','canceled',$2,false)",
      [user, future],
    );
    await db.query(
      "SELECT watch_sync_subscription('evt_old',100,$1,'cus_test','sub_test','past_due',$2,false)",
      [user, future],
    );
    await asUser(user);
    const snapshot = await mutate("create", {
      name: "Now paid",
      binding: { project: "flyai", identifier: wallet(6) },
    });
    expect(snapshot.projectDeviceLimit).toBe(50);
    expect(snapshot.projectCounts["flyai"]).toBe(6);
    await db.exec("RESET ROLE; SET ROLE service_role;");
    await db.query(
      "SELECT watch_sync_subscription('evt_cancel',400,$1,'cus_test','sub_test','canceled',$2,false)",
      [user, future],
    );
    await asUser(user);
    const after = await mutate("create", { name: "Keep overview" });
    expect(after.projectDeviceLimit).toBe(5);
    expect(after.projectCounts["flyai"]).toBe(6);
    await expect(
      mutate("create", { name: "More", binding: { project: "flyai", identifier: wallet(8) } }),
    ).rejects.toThrow("project_device_limit_reached");
  });
});

it("gives each new compute project an independent free quota", async () => {
  const id = "44444444-4444-4444-8444-444444444444";
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO auth.users(id) VALUES($1)", [id]);
  await asUser(id);
  for (let i = 0; i < 5; i++)
    await mutate("create", {
      name: `Compute ${i}`,
      binding: { project: "nosana", identifier: "1".repeat(31) + String(i + 2) },
    });
  await expect(
    mutate("create", {
      name: "Sixth",
      binding: { project: "nosana", identifier: "1".repeat(31) + "7" },
    }),
  ).rejects.toThrow();
  const data = await mutate("create", {
    name: "Gonka",
    binding: { project: "gonka", identifier: "gonka1346p2h8dn4kp98c5e93k5q64g0h7vxjxnd55fh" },
  });
  expect(data.projectCounts["nosana"]).toBe(5);
  expect(data.projectCounts["gonka"]).toBe(1);
});

it("applies independent quotas to the four new platforms and denies browser credential access",async()=>{
 const id="55555555-5555-4555-8555-555555555555";
 await db.exec("RESET ROLE");await db.query("INSERT INTO auth.users(id) VALUES($1)",[id]);await asUser(id);
 for(const project of ["akash","ionet","vast","golem"]){
  const identifier=(i:number)=>project==="vast"?String(i+1):project==="golem"?"0x"+String(i+1).padStart(40,"0"):project==="ionet"?`00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`:`akash1${"q".repeat(37)}${["p","z","r","y","9","x"][i]}`;
  for(let i=0;i<5;i++)await mutate("create",{name:`${project}-${i}`,binding:{project,identifier:identifier(i)}});
  await expect(mutate("create",{name:"Sixth",binding:{project,identifier:identifier(5)}})).rejects.toThrow(/project_device_limit_reached/);
 }
 await expect(db.query("SELECT * FROM watch_connections")).rejects.toThrow(/permission denied/);
 await expect(db.query("INSERT INTO watch_connections(user_id,project,ciphertext,expires_at) VALUES($1,'vast','fake',now())",[id])).rejects.toThrow(/permission denied/);
 await db.exec("RESET ROLE; SET ROLE anon;");await expect(db.query("SELECT * FROM watch_connections")).rejects.toThrow(/permission denied/);
});
