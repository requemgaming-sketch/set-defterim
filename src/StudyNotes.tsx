import {Fragment} from 'react';

// Deliberately renders text only: pasted HTML and links never execute.
function inline(text:string){return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part,i)=>part.startsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part.startsWith('*')?<em key={i}>{part.slice(1,-1)}</em>:part.startsWith('`')?<code key={i}>{part.slice(1,-1)}</code>:<Fragment key={i}>{part}</Fragment>)}
export default function StudyNotes({text}:{text:string}){
 const lines=text.replace(/\r\n/g,'\n').split('\n'),blocks=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i].trim().replace(/\\$/,'');
  if(!line)continue;
  if(line.startsWith('|')&&/^\|[\s:|-]+\|$/.test((lines[i+1]||'').trim())){
   const cells=(s:string)=>s.trim().replace(/^\||\|$/g,'').split('|').map(v=>v.trim());
   const heads=cells(line),rows:string[][]=[];i+=2;
   while(i<lines.length&&lines[i].trim().startsWith('|')){rows.push(cells(lines[i]));i++}i--;
   blocks.push(<div className="study-table" key={i}><table><thead><tr>{heads.map((h,j)=><th key={j}>{inline(h)}</th>)}</tr></thead><tbody>{rows.map((row,j)=><tr key={j}>{row.map((c,k)=><td key={k}>{inline(c)}</td>)}</tr>)}</tbody></table></div>);continue;
  }
  if(/^#{1,6}\s/.test(line)||/^\*\*\d+[.)]\s.+\*\*$/.test(line)){blocks.push(<h4 key={i}>{inline(line.replace(/^#{1,6}\s/,''))}</h4>);continue}
  if(line.startsWith('>')){blocks.push(<blockquote key={i}>{inline(line.replace(/^>\s?/,''))}</blockquote>);continue}
  blocks.push(<p key={i} className={line.startsWith('❌')?'study-correction':line.startsWith('✅')?'study-correct':undefined}>{inline(line)}</p>);
 }
 return <div className="study-notes">{blocks}</div>;
}
