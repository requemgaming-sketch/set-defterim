import test from 'node:test';
import assert from 'node:assert/strict';
import {moveItem,noteSections} from '../lib/studyNotes.ts';
test('Reordering preserves all exercise data and does not mutate input',()=>{
 const a={id:'a',sets:[{reps:8,weight:20,done:true}]},b={id:'b',sets:[{reps:6,weight:30,done:false}]};const original=[a,b];
 assert.deepEqual(moveItem(original,1,0),[b,a]);assert.deepEqual(original,[a,b]);assert.equal(moveItem(original,0,-1),original);assert.equal(moveItem(original,1,2),original);
});
test('Notebook recognizes copied plain, bold and markdown headings without losing body',()=>{
 const sections=noteSections('1. First topic\r\nExample one\r\n\r\n**2. Second topic**\nExample two\n## Words\nTerm\tMeaning\nword\tanlam');
 assert.equal(sections.length,3);assert.equal(sections[0].body,'Example one');assert.equal(sections[1].title,'2. Second topic');assert.ok(sections[2].body.includes('word\tanlam'));
 assert.deepEqual(noteSections('A plain note'),[{title:'Genel notlar',body:'A plain note'}]);assert.deepEqual(noteSections(''),[]);
});
