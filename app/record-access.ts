import {eq,or} from 'drizzle-orm';
import {assessments} from '../db/schema';
import type {ChatGPTUser} from './chatgpt-auth';
// Public submissions are readable only by the clinic owner, not other visitors.
export const PUBLIC_OWNER='clinic-public-submissions';
export function isClinicOwner(user:ChatGPTUser){return user.email.toLowerCase()==='blissnowme@gmail.com';}
export function recordAccess(user:ChatGPTUser){return isClinicOwner(user)?or(eq(assessments.owner,user.userId),eq(assessments.owner,PUBLIC_OWNER))!:eq(assessments.owner,user.userId);}
export function canEdit(user:ChatGPTUser|null,owner:string){return !!user&&(owner===user.userId||(owner===PUBLIC_OWNER&&isClinicOwner(user)));}
