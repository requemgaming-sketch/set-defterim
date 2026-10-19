import {dateString,weekStart,completed,type Entry} from './workouts.ts';
import type {JournalEntry} from './journal';
export function journalProgress(rows:JournalEntry[],workouts:Entry[],today:string,area:'today'|'career'|'english'){
 return Array.from({length:8},(_,i)=>{
  const date=new Date(weekStart(today)+'T12:00:00');date.setDate(date.getDate()-(7-i)*7);const start=dateString(date);date.setDate(date.getDate()+6);const end=dateString(date);
  const inWeek=(d:string)=>d>=start&&d<=end&&d<=today;
  const entries=rows.filter(r=>!r.data.archived&&inWeek(r.data.date)&&(area==='today'||r.data.area===area));
  const studies=entries.filter(r=>r.data.area!=='daily');
  const gym=workouts.filter(r=>inWeek(r.workout.date)&&completed(r.workout).length>0);
  return {date:start,minutes:studies.reduce((n,r)=>n+r.data.minutes,0),sessions:studies.length,independent:studies.filter(r=>r.data.outcome==='independent').length,career:studies.filter(r=>r.data.area==='career').length,english:studies.filter(r=>r.data.area==='english').length,gym:gym.length,goals:entries.filter(r=>r.data.area==='daily').reduce((n,r)=>n+r.data.goals.filter(g=>g.done&&g.text.trim()).length,0)};
 });
}
