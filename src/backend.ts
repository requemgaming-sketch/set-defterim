import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { workoutSchema, type Entry, type Workout } from '../lib/workouts';
export interface WorkoutRepository { list():Promise<Entry[]>;save(workout:Workout,revision:number):Promise<Entry>;remove(id:string,revision:number):Promise<void> }
export class ConflictError extends Error {constructor(){super('Bu antrenman başka bir cihazda değişti. Taslağı indirip güncel kaydı yükle.');}}
export async function connect(){
  const config:{supabaseUrl?:string;supabasePublishableKey?:string}=await fetch(`${import.meta.env.BASE_URL}config.json`,{cache:'no-store'}).then(r=>r.ok?r.json():{});
  const url=import.meta.env.VITE_SUPABASE_URL||config.supabaseUrl;
  const publicKey=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||config.supabasePublishableKey;
  if(!url||!publicKey)return null;
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url))throw new Error('Supabase proje adresi geçersiz.');
  let allowed=publicKey.startsWith('sb_publishable_');
  if(!allowed){try{const payload=JSON.parse(atob(publicKey.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));allowed=payload.role==='anon';}catch{/* Invalid or private key. */}}
  if(!allowed)throw new Error('Yalnızca public/publishable veya anon anahtarı kullanılabilir. Gizli anahtar kabul edilmez.');
  return createClient(url,publicKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
}
const convert=(r:any):Entry=>({workout:workoutSchema.parse(r.data),revision:r.revision,updatedAt:r.updated_at});
export function supabaseRepository(client:SupabaseClient,userId:string):WorkoutRepository {
  return {
    async list(){const all:Entry[]=[];for(let offset=0;;offset+=500){const {data,error}=await client.from('workouts').select('data,revision,updated_at').eq('user_id',userId).order('date',{ascending:false}).order('id').range(offset,offset+499);if(error)throw new Error('Kayıtlar yüklenemedi. Bağlantıyı kontrol edip tekrar dene.');all.push(...data.map(convert));if(data.length<500)break;}return all;},
    async save(workout,revision){const w=workoutSchema.parse(workout);const row={id:w.id,user_id:userId,date:w.date,data:w,revision:revision+1};const query=revision===0?client.from('workouts').insert(row):client.from('workouts').update({date:w.date,data:w,revision:revision+1}).eq('user_id',userId).eq('id',w.id).eq('revision',revision);const {data,error}=await query.select('data,revision,updated_at').maybeSingle();if(error?.code==='23505'||(!error&&!data))throw new ConflictError();if(error)throw new Error('Kaydedilemedi. İnternet bağlantını kontrol edip tekrar dene.');return convert(data);},
    async remove(id,revision){const {data,error}=await client.from('workouts').delete().eq('user_id',userId).eq('id',id).eq('revision',revision).select('id');if(error)throw new Error('Antrenman silinemedi.');if(!data?.length)throw new ConflictError();},
  };
}
export function demoRepository(initial:Entry[]):WorkoutRepository{let entries=structuredClone(initial);return {async list(){return structuredClone(entries)},async save(workout,revision){const old=entries.find(e=>e.workout.id===workout.id);if((old?.revision??0)!==revision)throw new ConflictError();const entry={workout:workoutSchema.parse(workout),revision:revision+1,updatedAt:new Date().toISOString()};entries=[entry,...entries.filter(e=>e.workout.id!==workout.id)];return structuredClone(entry)},async remove(id,revision){const old=entries.find(e=>e.workout.id===id);if(old?.revision!==revision)throw new ConflictError();entries=entries.filter(e=>e.workout.id!==id)}};}
