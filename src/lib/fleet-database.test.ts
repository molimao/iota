import { bech32m } from "@scure/base";
import { readFileSync } from "node:fs";
import { ergP2pkFromFill, zephStandardFromFill } from "./erg-zeph-validator";
import { fleetSnapshot } from "./fleet-policy";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

// These tests exercise historical migrations that intentionally report Free=5.
// Adapt only their returned snapshots to today's client policy; SQL assertions
// below still verify the original migrations and limits unchanged.
function historicalSnapshot(input: unknown) {
  const value = input as Record<string, unknown>;
  return fleetSnapshot(value["plan"] === "free" && value["projectDeviceLimit"] === 5
    ? { ...value, projectDeviceLimit: 3 }
    : value);
}

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
      devices: {
        id: string;
        bindings: { id: string; project: string; pool?: string; identifier?: string }[];
      }[];
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
  await db.exec(
    readFileSync("supabase/migrations/20261006200000_platform_connections.sql", "utf8"),
  );
  await db.exec(readFileSync("supabase/migrations/20261012213000_noid_acurast.sql", "utf8"));
  await db.exec(
    readFileSync("supabase/migrations/20261015180000_mining_pool_projects.sql", "utf8"),
  );
  await db.exec(readFileSync("supabase/migrations/20261017140000_midstate_mds.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261018140000_blocknet_bnt.sql", "utf8"));
  await db.exec(
    readFileSync("supabase/migrations/20261018150000_compute_substrate_csd.sql", "utf8"),
  );
  await db.exec(readFileSync("supabase/migrations/20261022140000_ergo_zephyr_pools.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261023190000_btc_ethw_pools.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261023220000_prl_luckypool.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261025220000_tensorcash_tsc.sql", "utf8"));
}, 60000);
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
    expect(after.rows[0]!.data.projectCounts["flyai"]).toBe(5);
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

it("applies independent quotas to the four new platforms and denies browser credential access", async () => {
  const id = "55555555-5555-4555-8555-555555555555";
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO auth.users(id) VALUES($1)", [id]);
  await asUser(id);
  for (const project of ["akash", "ionet", "vast", "golem"]) {
    const identifier = (i: number) =>
      project === "vast"
        ? String(i + 1)
        : project === "golem"
          ? "0x" + String(i + 1).padStart(40, "0")
          : project === "ionet"
            ? `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`
            : `akash1${"q".repeat(37)}${["p", "z", "r", "y", "9", "x"][i]}`;
    for (let i = 0; i < 5; i++)
      await mutate("create", {
        name: `${project}-${i}`,
        binding: { project, identifier: identifier(i) },
      });
    await expect(
      mutate("create", { name: "Sixth", binding: { project, identifier: identifier(5) } }),
    ).rejects.toThrow(/project_device_limit_reached/);
  }
  await expect(db.query("SELECT * FROM watch_connections")).rejects.toThrow(/permission denied/);
  await expect(
    db.query(
      "INSERT INTO watch_connections(user_id,project,ciphertext,expires_at) VALUES($1,'vast','fake',now())",
      [id],
    ),
  ).rejects.toThrow(/permission denied/);
  await db.exec("RESET ROLE; SET ROLE anon;");
  await expect(db.query("SELECT * FROM watch_connections")).rejects.toThrow(/permission denied/);
});

it("applies independent NOID and Acurast quotas and retains existing fleets", async () => {
  const id = "66666666-6666-4666-8666-666666666666";
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO auth.users(id) VALUES($1)", [id]);
  await asUser(id);
  await expect(
    mutate("create", {
      name: "Invalid",
      binding: { project: "acurast", identifier: "https://evil.invalid" },
    }),
  ).rejects.toThrow(/invalid_binding/);
  for (const project of ["noid", "acurast"]) {
    const identifier = (i: number) =>
      project === "noid"
        ? "o1" + "q".repeat(57) + ["p", "z", "r", "y", "9", "x"][i]
        : "0x" + String(i + 1).padStart(64, "0");
    for (let i = 0; i < 5; i++)
      await mutate("create", {
        name: `${project}-${i}`,
        binding: { project, identifier: identifier(i) },
      });
    await expect(
      mutate("create", { name: "Sixth", binding: { project, identifier: identifier(5) } }),
    ).rejects.toThrow(/project_device_limit_reached/);
  }
});

it("restores Free to five per project without removing legacy records or trial access", async () => {
  await db.exec("RESET ROLE");
  await db.exec(readFileSync("supabase/migrations/20261013180000_free_three_devices.sql", "utf8"));
  await db.exec(
    readFileSync("supabase/migrations/20261014110000_restore_free_five_devices.sql", "utf8"),
  );
  const id = "77777777-7777-4777-8777-777777777777";
  await db.query("INSERT INTO auth.users(id) VALUES($1)", [id]);
  await asUser(grandfather);
  const legacy = await db.query<{ data: { devices: unknown[]; projectDeviceLimit: number } }>(
    "SELECT watch_list_devices() AS data",
  );
  expect(legacy.rows[0]!.data.devices).toHaveLength(8);
  expect(legacy.rows[0]!.data.projectDeviceLimit).toBe(5);
  await asUser(id);
  for (let i = 1; i <= 5; i++)
    await mutate("create", {
      name: `New ${i}`,
      binding: { project: "flyai", identifier: wallet(i) },
    });
  await expect(
    mutate("create", { name: "Sixth", binding: { project: "flyai", identifier: wallet(6) } }),
  ).rejects.toThrow("project_device_limit_reached");
  const independent = await mutate("create", {
    name: "Other project",
    binding: { project: "golem", identifier: wallet(6) },
  });
  expect(independent.projectCounts["flyai"]).toBe(5);
  expect(historicalSnapshot(independent).devices).toHaveLength(6);
  expect(independent.projectCounts["golem"]).toBe(1);
  await db.exec("RESET ROLE");
  await db.query(
    "INSERT INTO watch_billing(user_id,stripe_customer,status,period_end) VALUES($1,'cus_quota_test','trialing',now()+interval '7 days')",
    [id],
  );
  await asUser(id);
  const trial = await mutate("create", {
    name: "Trial sixth",
    binding: { project: "flyai", identifier: wallet(6) },
  });
  expect(trial.projectDeviceLimit).toBe(50);
  expect(historicalSnapshot(trial).projectDeviceLimit).toBe(50);
  expect(trial.projectCounts["flyai"]).toBe(6);
});

it("keeps multiple project addresses in the account database and isolates another account", async () => {
  const batchUser = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO auth.users(id) VALUES($1)", [batchUser]);
  await asUser(batchUser);
  for (const n of [91, 92])
    await mutate("create", {
      name: `NOID test ${n}`,
      hardware: "",
      binding: {
        project: "noid",
        identifier: bech32m.encode("o", bech32m.toWords(new Uint8Array(32).fill(n))),
        worker: "",
      },
    });
  const own = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
  const snapshot = historicalSnapshot(own.rows[0]!.data);
  expect(snapshot.devices).toHaveLength(2);
  expect(snapshot.devices.flatMap((d) => d.bindings).every((b) => b.project === "noid")).toBe(true);
  await asUser(other);
  const different = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
  expect(
    historicalSnapshot(different.rows[0]!.data).devices.some((d) => d.name.startsWith("NOID test")),
  ).toBe(false);
});

describe("six mining pools persist in PostgreSQL", () => {
  it("round-trips six projects, pool and worker across reads; unlink releases quota", async () => {
    const owner = "99999999-4444-4444-8444-444444444444";
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [owner]);
    await asUser(owner);
    const samples = {
      prl: "prl1" + "q".repeat(58),
      xmr: "4" + "a".repeat(94),
      etc: "0x" + "a".repeat(40),
      rvn: "R" + "a".repeat(33),
      zec: "t1" + "a".repeat(33),
      kas: "kaspa:" + "q".repeat(61),
    };
    for (const [project, identifier] of Object.entries(samples)) {
      await mutate("create", { name: project, binding: { project, identifier, worker: "rig-01" } });
    }
    const read = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
    const snapshot = historicalSnapshot(read.rows[0]!.data);
    expect(snapshot.devices).toHaveLength(6);
    for (const d of snapshot.devices) {
      const b = d.bindings[0]!;
      expect(b.worker).toBe("rig-01");
      expect(b.pool).toBe(["prl", "xmr"].includes(b.project) ? "kryptex" : "2miners");
    }
    const first = snapshot.devices.find((d) => d.name === "prl")!;
    await expect(
      mutate("create", {
        name: "Duplicate",
        binding: { project: "prl", identifier: samples.prl, worker: "rig-01" },
      }),
    ).rejects.toThrow();
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "prl", identifier: samples.prl, worker: "rig-02", pool: "2miners" },
      }),
    ).rejects.toThrow();
    const next = await mutate("unlink", { id: first.id, bindingId: first.bindings[0]!.id });
    expect(next.projectCounts["prl"]).toBe(0);
    await asUser(other);
    await expect(mutate("remove", { id: first.id })).rejects.toThrow("device_not_found");
    await asUser(owner);
    for (let n = 0; n < 5; n++)
      await mutate("create", {
        name: `PRL ${n}`,
        binding: { project: "prl", identifier: samples.prl, worker: `rig-${n}` },
      });
    await expect(
      mutate("create", {
        name: "Sixth",
        binding: { project: "prl", identifier: samples.prl, worker: "rig-six" },
      }),
    ).rejects.toThrow("project_device_limit_reached");
  });
});

describe("Midstate saved-address persistence", () => {
  it("persists multiple addresses with LuckyPool, enforces ownership and updates count on unlink", async () => {
    await asUser(user);
    const before = await mutate("create", {
      name: "MDS rig 1",
      binding: { project: "mds", identifier: "ab".repeat(32) },
    });
    const first = before.devices.find((d) => d.bindings.some((b) => b.project === "mds"))!;
    const next = await mutate("create", {
      name: "MDS rig 2",
      binding: { project: "mds", identifier: "cd".repeat(32), pool: "luckypool" },
    });
    expect(next.projectCounts["mds"]).toBe(2);
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "mds", identifier: "ef".repeat(32), pool: "kryptex" },
      }),
    ).rejects.toThrow();
    await asUser(other);
    const foreign = await db.query<{ data: { devices: unknown[] } }>(
      "SELECT watch_list_devices() AS data",
    );
    expect(JSON.stringify(foreign.rows[0]!.data)).not.toContain("MDS rig 1");
    await expect(
      mutate("unlink", { id: first.id, bindingId: first.bindings[0]!.id }),
    ).rejects.toThrow("device_not_found");
    await asUser(user);
    const removed = await mutate("unlink", { id: first.id, bindingId: first.bindings[0]!.id });
    expect(removed.projectCounts["mds"]).toBe(1);
  });
});

describe("BNT database persistence", () => {
  it("persists multiple addresses, enforces ownership and independent quotas, and frees capacity on removal", async () => {
    const id = "77777777-2222-4222-8222-777777777777";
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [id]);
    await asUser(id);
    const address =
      "SEiNEceuDyfEY3GKDQAYVuK6382K2Ln2gQSv83ySAFkKhraBxhHnTf2P6PsF8CXtreqywg4T1qwBAjQo3L2VYDYWtsbb9";
    const first = await mutate("create", {
      name: "BNT CPU",
      binding: { project: "bnt", identifier: address, worker: "one" },
    });
    const device = first.devices[0]!;
    expect(first.projectCounts["bnt"]).toBe(1);
    await mutate("link", {
      id: device.id,
      binding: { project: "bnt", identifier: address, worker: "two" },
    });
    await mutate("link", {
      id: device.id,
      binding: {
        project: "bnt",
        identifier:
          "NrncwqmoEJmNeCCe9sd4PWZeY7z47Ld3CZg3VsCceEk9AE7EkNwHxnCwqmHcQdFp5efvf9omYydNpKUFkJ6XFqXRoZPF",
        worker: "cpu-two",
      },
    });
    const reloaded = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
    const parsed = historicalSnapshot(reloaded.rows[0]!.data);
    expect(parsed.devices[0]!.bindings).toHaveLength(3);
    expect(parsed.devices[0]!.bindings.every((b) => b.pool === "bntpool")).toBe(true);
    for (let i = 2; i <= 5; i++)
      await mutate("create", {
        name: `BNT ${i}`,
        binding: { project: "bnt", identifier: address, worker: `worker-${i}` },
      });
    await expect(
      mutate("create", {
        name: "Sixth",
        binding: { project: "bnt", identifier: address, worker: "six" },
      }),
    ).rejects.toThrow("project_device_limit_reached");
    await mutate("create", {
      name: "Other project",
      binding: { project: "etc", identifier: "0x" + "a".repeat(40) },
    });
    await asUser(other);
    await expect(mutate("remove", { id: device.id })).rejects.toThrow("device_not_found");
    await asUser(id);
    await mutate("remove", { id: device.id });
    const after = await mutate("create", {
      name: "Replacement",
      binding: { project: "bnt", identifier: address, worker: "replacement" },
    });
    expect(after.projectCounts["bnt"]).toBe(5);
  });
});

describe("CSD account storage", () => {
  it("normalizes addr20, saves multiple addresses, isolates ownership and releases the project quota on unlink", async () => {
    const owner = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      address = "a1".repeat(20),
      second = "b2".repeat(20);
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [owner]);
    await asUser(owner);
    const first = await mutate("create", {
      name: "CSD GPU",
      binding: { project: "csd", identifier: "0x" + address.toUpperCase() },
    });
    const id = first.devices[0]!.id;
    await expect(
      mutate("link", { id, binding: { project: "csd", identifier: address } }),
    ).rejects.toThrow(/duplicate key/);
    await mutate("link", { id, binding: { project: "csd", identifier: second } });
    const result = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
    const saved = historicalSnapshot(result.rows[0]!.data).devices[0]!;
    expect(saved.bindings.map((b) => b.identifier).sort()).toEqual([address, second].sort());
    expect(saved.bindings.every((b) => b.pool === "gpools")).toBe(true);
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "csd", identifier: "c3".repeat(20), pool: "kryptex" },
      }),
    ).rejects.toThrow();
    for (let i = 1; i <= 4; i++)
      await mutate("create", {
        name: `GPU ${i}`,
        binding: { project: "csd", identifier: i.toString(16).repeat(40) },
      });
    await expect(
      mutate("create", { name: "Sixth", binding: { project: "csd", identifier: "c3".repeat(20) } }),
    ).rejects.toThrow("project_device_limit_reached");
    await asUser(other);
    await expect(mutate("remove", { id })).rejects.toThrow("device_not_found");
    await asUser(owner);
    for (const b of saved.bindings) await mutate("unlink", { id, bindingId: b.id });
    const next = await mutate("create", {
      name: "New GPU",
      binding: { project: "csd", identifier: "c3".repeat(20) },
    });
    expect(next.projectCounts["csd"]).toBe(5);
  });
});

describe("Ergo and Zephyr saved-address persistence", () => {
  it("saves several wallets and workers, then renames, removes, quotas and isolates them", async () => {
    const owner = "44444444-5555-4666-8777-888888888888";
    const erg = [1, 2, 3, 4, 5, 6, 7].map((fill) => ergP2pkFromFill(fill));
    const zeph = [zephStandardFromFill(1), zephStandardFromFill(2)];
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [owner]);
    await asUser(owner);
    const created = await mutate("create", {
      name: "ERG rig",
      binding: { project: "erg", identifier: erg[0], worker: "w1" },
    });
    expect(created.projectDeviceLimit).toBe(5);
    expect(created.projectCounts["erg"]).toBe(1);
    const id = created.devices[0]!.id;
    const workers = await mutate("link", {
      id,
      binding: { project: "erg", identifier: erg[0], worker: "w2" },
    });
    expect(workers.projectCounts["erg"]).toBe(1);
    const wallets = await mutate("link", {
      id,
      binding: { project: "erg", identifier: erg[1], worker: "" },
    });
    expect(wallets.projectCounts["erg"]).toBe(1);
    const saved = historicalSnapshot(wallets).devices.find((device) => device.id === id)!;
    expect(saved.bindings.map((binding) => binding.identifier).sort()).toEqual(
      [erg[0], erg[0], erg[1]].sort(),
    );
    expect(saved.bindings.every((binding) => binding.pool === "2miners")).toBe(true);
    const renamed = historicalSnapshot(
      await mutate("rename", { id, name: "ERG renamed", hardware: "rx" }),
    );
    expect(renamed.devices.find((device) => device.id === id)?.name).toBe("ERG renamed");
    for (const fill of [2, 3, 4, 5]) {
      await mutate("create", {
        name: `ERG ${fill}`,
        binding: { project: "erg", identifier: erg[fill]!, worker: "solo-label" },
      });
    }
    await expect(
      mutate("create", {
        name: "ERG sixth",
        binding: { project: "erg", identifier: erg[6], worker: "extra" },
      }),
    ).rejects.toThrow("project_device_limit_reached");
    const zephSaved = await mutate("create", {
      name: "ZEPH rig",
      binding: { project: "zeph", identifier: zeph[0], worker: "a" },
    });
    expect(zephSaved.projectCounts["erg"]).toBe(5);
    expect(zephSaved.projectCounts["zeph"]).toBe(1);
    const zephId = zephSaved.devices.find((device) =>
      device.bindings.some((binding) => binding.project === "zeph"),
    )!.id;
    const zephWorkers = await mutate("link", {
      id: zephId,
      binding: { project: "zeph", identifier: zeph[1], worker: "b" },
    });
    expect(zephWorkers.projectCounts["zeph"]).toBe(1);
    expect(
      historicalSnapshot(zephWorkers)
        .devices.find((device) => device.id === zephId)
        ?.bindings.every((binding) => binding.pool === "2miners"),
    ).toBe(true);
    const legacy = await mutate("create", {
      name: "ETC still",
      binding: { project: "etc", identifier: "0x" + "ab".repeat(20), worker: "legacy" },
    });
    expect(legacy.projectCounts["etc"]).toBe(1);
    expect(
      historicalSnapshot(legacy).devices.find((device) => device.name === "ETC still")?.bindings[0],
    ).toMatchObject({ project: "etc", pool: "2miners" });
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "erg", identifier: erg[6], pool: "kryptex" },
      }),
    ).rejects.toThrow();
    await expect(
      mutate("create", {
        name: "URL",
        binding: { project: "zeph", identifier: "https://zeph.2miners.com/account/x" },
      }),
    ).rejects.toThrow();
    await asUser(other);
    await expect(mutate("rename", { id, name: "stolen", hardware: "" })).rejects.toThrow(
      "device_not_found",
    );
    await expect(mutate("remove", { id })).rejects.toThrow("device_not_found");
    await asUser(owner);
    const removed = await mutate("remove", { id });
    expect(removed.devices.some((device) => device.id === id)).toBe(false);
    expect(removed.projectCounts["erg"]).toBe(4);
    expect(removed.projectCounts["zeph"]).toBe(1);
  });
});

describe("Bitcoin and EthereumPoW saved-address persistence", () => {
  it("saves, reloads, renames, unlinks, and enforces quota without touching another user", async () => {
    const owner = "55555555-6666-4777-8888-999999999999";
    const btc = [
      "1BcktgV7EjHmxEwQDFFhhztzNqZkd5gdm",
      "31xwZP1fiFupFbZLiv2yUgrn8b3Zf2otfV",
      "bc1qqszqgpqyqszqgpqyqszqgpqyqszqgpqy5dl506",
      "bc1pqcrqvpsxqcrqvpsxqcrqvpsxqcrqvpsxqcrqvpsxqcrqvpsxqcrq47hap7",
      "bc1qq5zs2pg9q5zs2pg9q5zs2pg9q5zs2pg9q5zs2pg9q5zs2pg9q5zsjlsnv2",
      "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
    ];
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [owner]);
    await asUser(owner);
    const created = await mutate("create", {
      name: "BTC wallet",
      binding: { project: "btc", identifier: btc[0], worker: "rig-a" },
    });
    expect(created.projectCounts["btc"]).toBe(1);
    const id = historicalSnapshot(created).devices.find((device) => device.name === "BTC wallet")!.id;
    const workers = await mutate("link", {
      id,
      binding: { project: "btc", identifier: btc[0], worker: "rig-b" },
    });
    expect(workers.projectCounts["btc"]).toBe(1);
    const listed = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
    const reloaded = historicalSnapshot(listed.rows[0]!.data).devices.find(
      (device) => device.id === id,
    )!;
    expect(reloaded.bindings.filter((binding) => binding.project === "btc")).toHaveLength(2);
    expect(reloaded.bindings.every((binding) => binding.pool === "ckpool")).toBe(true);
    const renamed = await mutate("rename", { id, name: "BTC renamed", hardware: "s21" });
    expect(historicalSnapshot(renamed).devices.find((device) => device.id === id)?.name).toBe(
      "BTC renamed",
    );
    const second = reloaded.bindings.find((binding) => binding.worker === "rig-b")!;
    const unlinked = await mutate("unlink", { id, bindingId: second.id });
    expect(
      historicalSnapshot(unlinked).devices.find((device) => device.id === id)?.bindings,
    ).toHaveLength(1);
    expect(unlinked.projectCounts["btc"]).toBe(1);
    await expect(
      mutate("link", {
        id,
        binding: { project: "btc", identifier: "https://solo.ckpool.org/users/1abc" },
      }),
    ).rejects.toThrow();
    await expect(
      mutate("link", { id, binding: { project: "btc", identifier: btc[5], pool: "2miners" } }),
    ).rejects.toThrow();
    await expect(
      mutate("link", { id, binding: { project: "btc", identifier: btc[0], worker: "rig-a" } }),
    ).rejects.toThrow(/duplicate key/);
    for (const address of btc.slice(1, 5))
      await mutate("create", {
        name: address.slice(0, 8),
        binding: { project: "btc", identifier: address },
      });
    await expect(
      mutate("create", { name: "Sixth", binding: { project: "btc", identifier: btc[5] } }),
    ).rejects.toThrow("project_device_limit_reached");
    const ethw = await mutate("create", {
      name: "ETHW",
      binding: { project: "ethw", identifier: "0xAB" + "cd".repeat(19), worker: "" },
    });
    expect(ethw.projectCounts["btc"]).toBe(5);
    expect(ethw.projectCounts["ethw"]).toBe(1);
    expect(
      historicalSnapshot(ethw).devices.find((device) => device.name === "ETHW")?.bindings[0]?.identifier,
    ).toBe(("0xAB" + "cd".repeat(19)).toLowerCase());
    await expect(
      mutate("create", {
        name: "Bad",
        binding: { project: "btc", identifier: "https://solo.ckpool.org/users/1abc" },
      }),
    ).rejects.toThrow();
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "btc", identifier: btc[5], pool: "2miners" },
      }),
    ).rejects.toThrow();
    await asUser(other);
    await expect(mutate("rename", { id, name: "stolen", hardware: "" })).rejects.toThrow(
      "device_not_found",
    );
    await expect(mutate("unlink", { id, bindingId: second.id })).rejects.toThrow(
      "device_not_found",
    );
  });
});

describe("PRL accounts keep pool identity in PostgreSQL", () => {
  it("reloads both pools separately, enforces duplicate and quota rules, and isolates owners", async () => {
    const owner = "77777777-6666-4777-8888-999999999999";
    const address = "prl1" + "q".repeat(58);
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [owner]);
    await asUser(owner);
    await mutate("create", { name: "Kryptex", binding: { project: "prl", identifier: address } });
    const two = await mutate("create", {
      name: "LuckyPool",
      binding: { project: "prl", identifier: address, pool: "luckypool" },
    });
    expect(two.projectCounts["prl"]).toBe(2);
    const list = await db.query<{ data: unknown }>("SELECT watch_list_devices() AS data");
    const rows = historicalSnapshot(list.rows[0]!.data).devices;
    expect(rows.map((d) => d.bindings[0]?.pool).sort()).toEqual(["kryptex", "luckypool"]);
    const lucky = rows.find((d) => d.name === "LuckyPool")!;
    await expect(
      mutate("create", {
        name: "Duplicate",
        binding: { project: "prl", identifier: address, pool: "luckypool" },
      }),
    ).rejects.toThrow(/duplicate key/);
    await expect(
      mutate("create", {
        name: "Wrong pool",
        binding: { project: "prl", identifier: address, pool: "2miners" },
      }),
    ).rejects.toThrow();
    await expect(
      mutate("create", {
        name: "XMR wrong pool",
        binding: { project: "xmr", identifier: "4" + "a".repeat(94), pool: "luckypool" },
      }),
    ).rejects.toThrow();
    for (let i = 1; i <= 3; i++)
      await mutate("create", {
        name: "Extra " + i,
        binding: { project: "prl", identifier: address + "q".repeat(i), pool: "luckypool" },
      });
    await expect(
      mutate("create", {
        name: "Sixth",
        binding: { project: "prl", identifier: address + "qqqq", pool: "luckypool" },
      }),
    ).rejects.toThrow("project_device_limit_reached");
    await asUser(other);
    await expect(
      mutate("unlink", { id: lucky.id, bindingId: lucky.bindings[0]!.id }),
    ).rejects.toThrow("device_not_found");
    await asUser(owner);
    const freed = await mutate("unlink", { id: lucky.id, bindingId: lucky.bindings[0]!.id });
    expect(freed.projectCounts["prl"]).toBe(4);
    const added = await mutate("create", {
      name: "Replacement",
      binding: { project: "prl", identifier: address + "qqqq", pool: "luckypool" },
    });
    expect(added.projectCounts["prl"]).toBe(5);
  });
});

it("persists multiple TensorCash addresses with owner scope and project counts", async () => {
  await asUser(other);
  const a = "tc1qmvalge7mnhct9qj5uua8rn0dmjcyh6fmvrr46j",
    b = "tc1qh3rce3jqcf7an5uljx9gnxreckdl7juf56l2rh";
  const first = await mutate("create", {
    name: "TSC one",
    hardware: "",
    binding: { project: "tsc", identifier: a, worker: "" },
  });
  const second = await mutate("create", {
    name: "TSC two",
    hardware: "",
    binding: { project: "tsc", identifier: b, worker: "" },
  });
  expect(first.projectCounts["tsc"]).toBe(1);
  expect(second.projectCounts["tsc"]).toBe(2);
  expect(second.devices.filter((d) => d.bindings.some((b) => b.project === "tsc"))).toHaveLength(2);
  await asUser(user);
  const listed = await db.query<{ data: { devices: { bindings: { project: string }[] }[] } }>(
    "SELECT watch_list_devices() AS data",
  );
  expect(
    listed.rows[0]!.data.devices.some((d) => d.bindings.some((b) => b.project === "tsc")),
  ).toBe(false);
});

it("persists TSC pool per address and isolates the same wallet across pools", async () => {
  await asUser(user);
  const address = "tc1qmvalge7mnhct9qj5uua8rn0dmjcyh6fmvrr46j";
  for (const pool of ["tigerpool", "boblabs", "ariapool", "luckypool", "suprnova"]) {
    const state = await mutate("create", {
      name: `TSC ${pool}`,
      binding: { project: "tsc", identifier: address, pool, worker: "" },
    });
    expect(
      state.devices.some((d) =>
        d.bindings.some((b) => b.project === "tsc" && b.pool === pool && b.identifier === address),
      ),
    ).toBe(true);
  }
  await expect(
    mutate("create", {
      name: "wrong",
      binding: { project: "tsc", identifier: address, pool: "kryptex" },
    }),
  ).rejects.toThrow();
});
