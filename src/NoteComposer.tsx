import {useEffect,useState} from 'react';
export default function NoteComposer({notes,onChange,onPending}:{notes:string;onChange:(notes:string)=>void;onPending:(pending:boolean)=>void}){
 const [topic,setTopic]=useState(''),[rule,setRule]=useState(''),[example,setExample]=useState(''),[wrong,setWrong]=useState(''),[correct,setCorrect]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{onPending([topic,rule,example,wrong,correct].some(v=>v.trim()))},[topic,rule,example,wrong,correct,onPending]);
 function append(){
  if(!topic.trim()||![rule,example,wrong,correct].some(v=>v.trim())){setMessage('Konu başlığı ve en az bir kural, örnek veya düzeltme yaz.');return}
  const card=[`## ${topic.trim()}`,rule.trim(),example.trim()?`> ${example.trim().replace(/\n/g,'\n> ')}`:'',wrong.trim()?`❌ ${wrong.trim()}`:'',correct.trim()?`✅ ${correct.trim()}`:''].filter(Boolean).join('\n\n');
  const next=[notes.trimEnd(),card].filter(Boolean).join('\n\n');
  if(next.length>20000){setMessage('Not sınırına ulaştın. Bu konuyu ayrı bir çalışma olarak kaydet.');return}
  onChange(next);setTopic('');setRule('');setExample('');setWrong('');setCorrect('');setMessage('Konu taslağa eklendi. Bitirdiğinde aşağıdan kaydet.');
 }
 return <details className="note-composer"><summary>Adım adım konu kartı ekle</summary><p className="muted">Her kartta tek fikir tut: kısa bir kural, kendi örneğin ve varsa düzeltmen.</p><div className="composer-fields"><label>Konu başlığı<input maxLength={160} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Örn. consider + ing"/></label><label>Kısa kural<textarea rows={2} maxLength={2000} value={rule} onChange={e=>setRule(e.target.value)}/></label><label>Kendi örnek cümlen<textarea rows={2} maxLength={2000} value={example} onChange={e=>setExample(e.target.value)}/></label><div className="life-form-grid"><label>Önceki / yanlış hâli<input maxLength={1000} value={wrong} onChange={e=>setWrong(e.target.value)}/></label><label>Düzeltilmiş hâli<input maxLength={1000} value={correct} onChange={e=>setCorrect(e.target.value)}/></label></div><button type="button" className="secondary" onClick={append}>Konu kartını nota ekle</button>{message&&<p role="status" className="muted">{message}</p>}</div></details>
}
