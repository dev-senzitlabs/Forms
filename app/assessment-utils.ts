export function todayLocal(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function ageFromBirth(birth: string, on = todayLocal()): number | '' {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth || '') || birth > on) return '';
  const [y,m,d] = birth.split('-').map(Number);
  const check = new Date(y,m-1,d);
  if(check.getFullYear() !== y || check.getMonth() !== m-1 || check.getDate() !== d) return '';
  const [cy,cm,cd] = on.split('-').map(Number);
  return cy-y-((cm<m || (cm===m && cd<d)) ? 1 : 0);
}
export function normalizeAssessment(data: Record<string, any>) {
  const legacy=data['Pain Day-wise Status']??data['24 hours'];
  return {...data, 'Pain Day-wise Status':Array.isArray(legacy)?legacy.join('; '):legacy??'', Gender: data.Gender ?? (data.Sex === 'Other' ? '' : data.Sex) ?? '', Age: data['Date of birth'] ? ageFromBirth(data['Date of birth'], data.Date || todayLocal()) : data.Age ?? ''};
}
