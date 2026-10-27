import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, it, expect } from 'vitest';
let db:PGlite;
async function value<T>(sql:string,args:unknown[]=[]){return (await db.query<{v:T}>(sql,args)).rows[0]?.v;}
beforeAll(async()=>{db=new PGlite();await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;');await db.exec(readFileSync('supabase/migrations/20261027190000_payment_notifications.sql','utf8'));},30000);
afterAll(()=>db.close());
it('restricts access and keeps each invoice idempotent across retries',async()=>{
 await db.exec('SET ROLE authenticated');
 await expect(db.query("SELECT watch_payment_notification_enqueue('in_a','{}'::jsonb)")).rejects.toThrow('permission denied');
 await expect(db.query('SELECT * FROM watch_payment_notifications')).rejects.toThrow('permission denied');
 await db.exec('RESET ROLE; SET ROLE service_role');
 await db.query("SELECT watch_payment_notification_enqueue('in_a','{}'::jsonb)");
 await db.query("SELECT watch_payment_notification_enqueue('in_a','{}'::jsonb)");
 const first=await value<{invoiceId:string,lease:string}>("SELECT watch_payment_notification_worker('claim') AS v");
 expect(first?.invoiceId).toBe('in_a');expect(await value("SELECT watch_payment_notification_worker('claim') AS v")).toBeNull();
 expect(await value("SELECT watch_payment_notification_worker('retry',$1,$2) AS v",['in_a',first?.lease])).toBe(true);
 await db.exec("RESET ROLE; UPDATE watch_payment_notifications SET next_at=now()-interval '1 second'; SET ROLE service_role");
 const next=await value<{invoiceId:string,lease:string}>("SELECT watch_payment_notification_worker('claim') AS v");
 expect(next?.invoiceId).toBe('in_a');expect(next?.lease).not.toBe(first?.lease);
 expect(await value("SELECT watch_payment_notification_worker('sent',$1,$2) AS v",['in_a',first?.lease])).toBe(false);
 expect(await value("SELECT watch_payment_notification_worker('sent',$1,$2) AS v",['in_a',next?.lease])).toBe(true);
 await db.query("SELECT watch_payment_notification_enqueue('in_a','{}'::jsonb)");
 expect(await value("SELECT watch_payment_notification_worker('claim') AS v")).toBeNull();
},30000);
