import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Match Status Enum
export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);

// 2. Matches Table
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatusEnum('status').default('scheduled').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Commentary Table
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minute: integer('minute'),
  sequence: integer('sequence').notNull(),
  period: text('period'),
  eventType: text('event_type').notNull(),
  actor: text('actor'),
  team: text('team'),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Relations
export const matchesRelations = relations(matches, ({ many }) => ({
  commentary: many(commentary),
}));

export const commentaryRelations = relations(commentary, ({ one }) => ({
  match: one(matches, {
    fields: [commentary.matchId],
    references: [matches.id],
  }),
}));

// // Retained for legacy demo compatibility
// export const demoUsers = pgTable('demo_users', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });
