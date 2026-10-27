import {it,expect} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
it('rejects Linux controls in the database while preserving Mac controls',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,snapshot jsonb);
 CREATE TABLE watch_agent_commands(device_id uuid,action text);`);
 await db.exec(readFileSync('supabase/migrations/20261027120000_linux_agent_readonly.sql','utf8'));
 const linux='11111111-1111-4111-8111-111111111111',mac='22222222-2222-4222-8222-222222222222';
 await db.query('INSERT INTO watch_device_agents VALUES($1,$2::jsonb),($3,$4::jsonb)',[linux,JSON.stringify({platform:'linux'}),mac,'{}']);
 for(const action of ['start','stop','restart','update']) await expect(db.query('INSERT INTO watch_agent_commands VALUES($1,$2)',[linux,action])).rejects.toThrow('agent_monitor_only');
 await db.query('INSERT INTO watch_agent_commands VALUES($1,$2)',[mac,'restart']);
 expect((await db.query('SELECT * FROM watch_agent_commands')).rows).toHaveLength(1);
 }finally{await db.close();}
},30000);
