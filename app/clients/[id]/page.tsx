import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {assessments} from '../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {recordAccess,browserAccess} from '../../record-access';
import {notFound} from 'next/navigation';
import ClientReport from '../../client-report';
import {normalizeAssessment} from '../../assessment-utils';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const user=await getChatGPTUser();const access=recordAccess(user,await browserAccess());if(!access)notFound();const rows=await getDb().select().from(assessments).where(and(eq(assessments.id,id),access));if(!rows.length)notFound();return <ClientReport record={{id:rows[0].id,created:rows[0].created,data:normalizeAssessment(JSON.parse(rows[0].data))}}/>;}
