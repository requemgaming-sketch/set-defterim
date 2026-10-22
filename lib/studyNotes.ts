export type NoteSection={title:string;body:string};
export function noteSections(text:string):NoteSection[]{
 const sections:NoteSection[]=[];let current:NoteSection={title:'Genel notlar',body:''};
 for(const raw of text.replace(/\r\n/g,'\n').split('\n')){
  const clean=raw.trim().replace(/^\*\*(.+)\*\*$/,'$1');
  const heading=clean.match(/^#{1,6}\s+(.+)$/)||clean.match(/^(\d+[.)]\s+.+)$/);
  if(heading){if(current.body.trim())sections.push({...current,body:current.body.trim()});current={title:heading[1],body:''}}
  else current.body+=raw+'\n';
 }
 if(current.body.trim()||current.title!=='Genel notlar')sections.push({...current,body:current.body.trim()});
 return sections;
}
export function moveItem<T>(items:T[],from:number,to:number):T[]{
 if(from<0||to<0||from>=items.length||to>=items.length||from===to)return items;
 const result=[...items];const [item]=result.splice(from,1);result.splice(to,0,item);return result;
}
