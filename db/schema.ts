import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const assessments = sqliteTable('assessments', { id: text('id').primaryKey(), owner: text('owner').notNull(), created: text('created').notNull(), data: text('data').notNull() });
