import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
it('keeps Pro entitlement and sets 100 devices per project while Free remains 3', async () => {
 const db = new PGlite();
 try {
  await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,deleted_at timestamptz); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;");
  for (const name of ['20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql','20261005130000_fleet_and_billing.sql','20261006190000_compute_projects.sql','20261006200000_platform_connections.sql','20261010180000_daily_reports.sql','20261011120000_pro_tools.sql','20261011235900_history_backfill.sql','20261012120000_pro_trials.sql','20261027160000_free_three_devices.sql','20261027170000_pro_hundred_devices.sql']) await db.exec(readFileSync(`supabase/migrations/${name}`,'utf8'));
  const id='11111111-1111-4111-8111-111111111111', free='22222222-2222-4222-8222-222222222222';
  await db.query("INSERT INTO auth.users(id,email,email_confirmed_at) VALUES($1,'pro@example.invalid',now()),($2,'free@example.invalid',now())",[id,free]);
  await db.query("INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'trialing',now()+interval '7 days')",[id]);
  await db.exec('SET ROLE authenticated'); await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]);
  const result = await db.query<{d:{plan:string;projectDeviceLimit:number}}>('SELECT watch_list_devices() d');
  expect(result.rows[0]!.d).toMatchObject({plan:'pro',projectDeviceLimit:100});
  const status=await db.query<{d:{eligible:boolean}}>('SELECT watch_pro_status() d'); expect(status.rows[0]!.d.eligible).toBe(true);
  const report=await db.query<{d:{eligible:boolean}}>('SELECT watch_report_status() d'); expect(report.rows[0]!.d.eligible).toBe(true);
  for (let n=1;n<=100;n++) await db.query('SELECT watch_mutate_device($1,$2::jsonb)', ['create',JSON.stringify({name:`rig ${n}`,binding:{project:'flyai',identifier:'0x'+n.toString(16).padStart(40,'0')}})]);
  await expect(db.query('SELECT watch_mutate_device($1,$2::jsonb)', ['create',JSON.stringify({name:'rig 101',binding:{project:'flyai',identifier:'0x' + (101).toString(16).padStart(40,'0')}})])).rejects.toThrow('project_device_limit_reached');
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[free]);
  const freeResult=await db.query<{d:{plan:string;projectDeviceLimit:number}}>('SELECT watch_list_devices() d');
  expect(freeResult.rows[0]!.d).toMatchObject({plan:'free',projectDeviceLimit:3});
 } finally {await db.close();}
},30000);
