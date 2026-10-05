import { z } from 'zod';
const numberText=z.string().max(12).refine(v=>v==='' || (/^\d+(?:[.,]\d+)?$/.test(v)&&Number(v.replace(',','.'))<=2000),'Geçerli bir sayı gir.');
export const setSchema=z.object({id:z.string().uuid(),weight:numberText,reps:z.string().max(4).refine(v=>v===''||(/^\d+$/.test(v)&&Number(v)<=1000)),done:z.boolean()}).refine(s=>!s.done||(s.weight!==''&&s.reps!==''&&Number(s.reps)>0),'Tamamlanan setin kilosunu ve tekrarını gir.');
export const workoutSchema=z.object({id:z.string().uuid(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T12:00:00Z');return !isNaN(+d)&&d.toISOString().slice(0,10)===v}),split:z.string().trim().min(1).max(50),notes:z.string().max(2000),sleep:z.string().max(5).refine(v=>v===''||(/^\d+(?:[.,]\d+)?$/.test(v)&&Number(v.replace(',','.'))<=24)),energy:z.enum(['','1','2','3','4','5']),exercises:z.array(z.object({id:z.string().uuid(),name:z.string().trim().min(1).max(100),sets:z.array(setSchema).max(40)})).max(60)});
export type Workout=z.infer<typeof workoutSchema>;
export type Exercise=Workout['exercises'][number];
export type LiftSet=Exercise['sets'][number];
export type Entry={workout:Workout;revision:number;updatedAt:string};
export const num=(s:string)=>Number(s.replace(',','.'));
export const key=(s:string)=>s.trim().replace(/\s+/g,' ').toLocaleLowerCase('tr-TR');
export const dateString=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const dayLabel=(d:string)=>new Date(d+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
export function weekStart(date:string){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));return dateString(d);}
export function completed(w:Workout){return w.exercises.flatMap(e=>e.sets.filter(s=>s.done));}
export function volume(sets:LiftSet[]){return sets.filter(s=>s.done).reduce((v,s)=>v+num(s.weight)*num(s.reps),0);}
export function points(entries:Entry[],name:string){return entries.map(e=>{const sets=e.workout.exercises.filter(x=>key(x.name)===key(name)).flatMap(x=>x.sets.filter(s=>s.done));if(!sets.length)return null;const weight=Math.max(...sets.map(s=>num(s.weight)));return {id:e.workout.id,date:e.workout.date,weight,reps:Math.max(...sets.filter(s=>num(s.weight)===weight).map(s=>num(s.reps))),volume:volume(sets),sets,notes:e.workout.notes,sleep:e.workout.sleep,energy:e.workout.energy};}).filter((v):v is NonNullable<typeof v>=>v!==null).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));}
