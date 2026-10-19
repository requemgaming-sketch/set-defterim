import test from 'node:test';
import assert from 'node:assert/strict';
import {journalSchema,journalStats} from '../lib/journal.ts';
const data={id:'10000000-0000-4000-8000-000000000001',date:'2026-10-19',area:'career',topic:'SQL',title:'Joins',minutes:30,notes:'',practice:'',next:'Two exercises',review:true,archived:false,outcome:'practice',goals:[]};
test('Journal validates dates, duration and required fields',()=>{assert.equal(journalSchema.safeParse(data).success,true);for(const patch of [{date:'2026-02-30'},{minutes:-1},{minutes:1.5},{minutes:1441},{title:' '},{area:'gym'}])assert.equal(journalSchema.safeParse({...data,...patch}).success,false)});
test('Learning stats exclude archived, daily and out-of-range records; active days are unique',()=>{const row=journalSchema.parse(data);const entries=[row,{...row,area:'english' as const,minutes:20,outcome:'independent' as const},{...row,archived:true},{...row,area:'daily' as const},{...row,date:'2026-10-18'}].map(data=>({data,revision:1,updatedAt:''}));assert.deepEqual(journalStats(entries,'2026-10-19','2026-10-25'),{sessions:2,minutes:50,days:1,independent:1})});
