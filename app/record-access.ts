import {eq,or,like} from 'drizzle-orm';
import {headers} from 'next/headers';
import {assessments} from '../db/schema';
import type {ChatGPTUser} from './chatgpt-auth';
export const PUBLIC_OWNER='clinic-public-submissions';
export const ACCESS_COOKIE='bliss_records_access';
export function isClinicOwner(user:ChatGPTUser){return user.email.toLowerCase()==='blissnowme@gmail.com';}
export async function browserAccess(){const raw=(await headers()).get('cookie')||'';const token=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(ACCESS_COOKIE+'='))?.slice(ACCESS_COOKIE.length+1);if(!token||!/^\w{64}$/.test(token))return null;return ownerForToken(token);}
export async function ownerForToken(token:string){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return 'browser:'+Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');}
export function newBrowserToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');}
export function recordAccess(user:ChatGPTUser|null,browserOwner:string|null){const conditions=[];if(browserOwner)conditions.push(eq(assessments.owner,browserOwner));if(user){conditions.push(eq(assessments.owner,user.userId));if(isClinicOwner(user))conditions.push(eq(assessments.owner,PUBLIC_OWNER),like(assessments.owner,'browser:%'));}return conditions.length?or(...conditions):undefined;}
export function canEdit(user:ChatGPTUser|null,browserOwner:string|null,owner:string){return owner===browserOwner||!!user&&(owner===user.userId||isClinicOwner(user)&&(owner===PUBLIC_OWNER||owner.startsWith('browser:')));}
