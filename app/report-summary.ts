import {sections} from './fields';
export type SummaryRow={label:string,value:string};
export type SummarySection={title:string,rows:SummaryRow[]};
export function hasValue(v:any):boolean{return Array.isArray(v)?v.some(hasValue):v!==undefined&&v!==null&&String(v).trim()!=='';}
export function reportValue(v:any):string{return Array.isArray(v)?v.filter(hasValue).join(', '):String(v??'');}
function compactRows(data:Record<string,any>,fields:{label:string}[],groups:{label:string,keys:string[],names?:string[]}[]):SummaryRow[]{const rows:SummaryRow[]=[];const used=new Set<string>();for(const f of fields){if(used.has(f.label))continue;const group=groups.find(g=>g.keys.includes(f.label));if(group){group.keys.forEach(k=>used.add(k));const parts=group.keys.flatMap((key,i)=>hasValue(data[key])?[`${group.names?.[i]||key}: ${reportValue(data[key])}`]:[]);if(parts.length)rows.push({label:group.label,value:parts.join(' · ')});}else if(hasValue(data[f.label]))rows.push({label:f.label,value:reportValue(data[f.label])});}return rows;}
export function reportSections(data:Record<string,any>):SummarySection[]{return [
 {title:'Main complaint',rows:compactRows(data,sections[1].fields,[
  {label:'Onset / duration',keys:['Onset','Since','Duration']},
  {label:'Pain scores (0–10)',keys:['Pain — Now (0–10)','Pain — At rest (0–10)','Pain — Moving (0–10)','Pain — Worst (0–10)'],names:['Now','At rest','Moving','Worst']},
  {label:'Aggravating / relieving factors',keys:['Worse with','Better with'],names:['Worse','Better']},
  {label:'Daily pattern / morning stiffness',keys:['Pain Day-wise Status','Morning stiffness — minutes'],names:['Pattern','Morning stiffness (minutes)']}
 ])},
 {title:'Medical history',rows:compactRows(data,sections[3].fields,[{label:'Medication',keys:['Medication','Other medication'],names:['Selected','Other']},{label:'Sleep / stress',keys:['Sleep','Stress (0–10)'],names:['Sleep','Stress (0–10)']}])},
 {title:'Safety screening / action',rows:compactRows(data,sections[4].fields,[{label:'Action / referral',keys:['Action','Referral priority','Refer to'],names:['Action','Priority','Referred to']}])},
 {title:'Patient context',rows:compactRows(data,sections[0].fields.filter(f=>!['Name','Phone number','Age','Date'].includes(f.label)),[{label:'Profile',keys:['Date of birth','Gender','Dominant side'],names:['DOB','Gender','Dominant side']},{label:'Work / activity',keys:['Occupation','Sport / activities'],names:['Occupation','Activities']},{label:'Referral / session',keys:['GP / referred by','Session number'],names:['Referred by','Session']}])}
];}
export function markerSummary(markers:any[]):string{const counts=new Map<string,number>();for(const m of markers){const key=`${m.side}: ${m.symptom} ${m.intensity}/10`;counts.set(key,(counts.get(key)||0)+1);}return [...counts].map(([key,n])=>key+(n>1?` (${n} sites)`:'' )).join(' · ');}
