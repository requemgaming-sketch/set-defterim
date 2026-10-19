import { z } from 'zod';
export const journalSchema=z.object({
 id:z.string().uuid(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T12:00:00Z');return !isNaN(+d)&&d.toISOString().slice(0,10)===s}),
 area:z.enum(['career','english','daily']),topic:z.string().trim().min(1).max(100),title:z.string().trim().min(1).max(160),
 minutes:z.number().int().min(0).max(1440),notes:z.string().max(20000),practice:z.string().max(10000),next:z.string().max(2000),
 review:z.boolean(),archived:z.boolean(),outcome:z.enum(['practice','independent','completed']),
 goals:z.array(z.object({text:z.string().max(200),done:z.boolean()})).max(3)
});
export type Journal=z.infer<typeof journalSchema>;
export type JournalEntry={data:Journal;revision:number;updatedAt:string};
export function journalStats(entries:JournalEntry[],start:string,end:string){const rows=entries.filter(e=>!e.data.archived&&e.data.area!=='daily'&&e.data.date>=start&&e.data.date<=end);return {sessions:rows.length,minutes:rows.reduce((n,e)=>n+e.data.minutes,0),days:new Set(rows.map(e=>e.data.date)).size,independent:rows.filter(e=>e.data.outcome==='independent').length};}
