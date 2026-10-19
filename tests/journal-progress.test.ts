import test from 'node:test';
import assert from 'node:assert/strict';
import {journalProgress} from '../lib/journalProgress.ts';
import type {JournalEntry} from '../lib/journal.ts';
const row:JournalEntry={revision:1,updatedAt:'',data:{id:'10000000-0000-4000-8000-000000000001',date:'2026-10-20',area:'english',topic:'Grammar',title:'Study',minutes:30,notes:'',practice:'',next:'',review:false,archived:false,outcome:'independent',goals:[]}};
test('Progress uses Monday weeks and excludes archived and future records',()=>{
 const rows=[row,{...row,data:{...row.data,archived:true}},{...row,data:{...row.data,date:'2026-10-21'}},{...row,data:{...row.data,date:'2026-10-18',minutes:15}},{...row,data:{...row.data,area:'career' as const}}];
 const weeks=journalProgress(rows,[],'2026-10-20','english');
 assert.equal(weeks.length,8);assert.equal(weeks[7].date,'2026-10-19');assert.equal(weeks[7].minutes,30);assert.equal(weeks[7].sessions,1);assert.equal(weeks[7].independent,1);assert.equal(weeks[6].minutes,15);assert.equal(weeks[0].sessions,0);
});
test('Overview separates areas and counts only named completed daily goals',()=>{
 const daily={...row,data:{...row.data,area:'daily' as const,goals:[{text:'Review',done:true},{text:'',done:true},{text:'Read',done:false}]}};
 const w=journalProgress([row,daily],[],'2026-10-20','today')[7];
 assert.equal(w.goals,1);assert.equal(w.english,1);assert.equal(w.career,0);assert.equal(w.minutes,30);assert.equal(w.sessions,1);
});
