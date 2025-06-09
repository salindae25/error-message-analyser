import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const errorMessages = sqliteTable('error_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  analysis: text('analysis').notNull(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}); 