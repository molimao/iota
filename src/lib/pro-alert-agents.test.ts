import { expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { readAlertAgents } from "./pro-alert-agents.server";

function fixture(result: object) {
  const query = { select: vi.fn(), eq: vi.fn(), in: vi.fn(), abortSignal: vi.fn().mockResolvedValue(result) };
  query.select.mockReturnValue(query); query.eq.mockReturnValue(query); query.in.mockReturnValue(query);
  const from = vi.fn().mockReturnValue(query);
  return { query, from, client: { from } as unknown as SupabaseClient<Database> };
}
it("reads only task-owned devices, without requesting control credentials", async () => {
  const f = fixture({ error: null, data: [{device_id:"owned",last_seen:null,snapshot:{appRunning:true,workerRunning:false}}] });
  const agents = await readAlertAgents(f.client,"owner",["owned","owned"]);
  expect(f.query.eq).toHaveBeenCalledWith("user_id","owner");
  expect(f.query.in).toHaveBeenCalledWith("device_id",["owned"]);
  expect(f.query.select).toHaveBeenCalledWith("device_id,last_seen,snapshot");
  expect(agents?.get("owned")?.snapshot.workerRunning).toBe(false);
});
it("distinguishes failed reads from unpaired devices and keeps malformed pairing evidence unknown", async () => {
  expect(await readAlertAgents(fixture({error:{message:"unavailable"},data:null}).client,"owner",["x"])).toBeNull();
  expect((await readAlertAgents(fixture({error:null,data:[]}).client,"owner",["x"]))?.size).toBe(0);
  const f = fixture({error:null,data:[{device_id:"x",last_seen:null,snapshot:{appRunning:"invalid"}}]});
  expect((await readAlertAgents(f.client,"owner",["x"]))?.get("x")?.snapshot).toEqual({});
  const empty = fixture({});
  expect((await readAlertAgents(empty.client,"owner",[]))?.size).toBe(0);
  expect(empty.from).not.toHaveBeenCalled();
});
