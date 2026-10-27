import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('limits new free devices to three without deleting prior devices or affecting Pro', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;`);
    for (const name of ['20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql','20261005130000_fleet_and_billing.sql','20261006190000_compute_projects.sql']) await db.exec(readFileSync(`supabase/migrations/${name}`,'utf8'));
    const free='11111111-1111-4111-8111-111111111111', pro='22222222-2222-4222-8222-222222222222', fresh='33333333-3333-4333-8333-333333333333';
    await db.query('INSERT INTO auth.users(id) VALUES ($1),($2),($3)',[free,pro,fresh]);
    await db.query("INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'trialing',now()+interval '7 days')",[pro]);
    const use = async (id:string) => { await db.exec('RESET ROLE; SET ROLE authenticated'); await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]); };
    const create = async (n:number, project='flyai') => db.query('SELECT watch_mutate_device($1,$2::jsonb)', ['create',JSON.stringify({name:`device ${n}`,binding:{project,identifier:'0x'+n.toString(16).padStart(40,'0')}})]);
    await use(free);
    for(let i=1;i<=5;i++) await create(i);
    await db.exec('RESET ROLE');
    await db.exec(readFileSync('supabase/migrations/20261027160000_free_three_devices.sql','utf8'));
    await use(free);
    const list = await db.query<{ data: { devices: unknown[]; projectDeviceLimit: number } }>('SELECT watch_list_devices() AS data');
    expect(list.rows[0]!.data.devices).toHaveLength(5);
    expect(list.rows[0]!.data.projectDeviceLimit).toBe(3);
    await expect(create(6)).rejects.toThrow('project_device_limit_reached');
    await create(6,'golem');
    await use(fresh);
    for(let i=20;i<23;i++) await create(i);
    await expect(create(23)).rejects.toThrow('project_device_limit_reached');
    await create(23,'golem');
    await use(pro);
    const proList=await db.query<{ data: {projectDeviceLimit:number} }>('SELECT watch_list_devices() AS data');
    expect(proList.rows[0]!.data.projectDeviceLimit).toBe(50);
    for(let i=10;i<14;i++) await create(i);
  } finally { await db.close(); }
}, 30000);
