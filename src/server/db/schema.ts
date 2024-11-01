import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Account } from "next-auth";
import { createId } from "@paralleldrive/cuid2";

const DEFAULT_ID_LENGTH = 50;

export const users = pgTable("user", {
  id: varchar("id", { length: DEFAULT_ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  routeId: varchar("route_id", { length: DEFAULT_ID_LENGTH }),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    precision: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  sequence: integer("sequence"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  answers: many(answers, {
    relationName: "userAnswers",
  }),
  route: one(routes, {
    fields: [users.routeId],
    references: [routes.id],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: DEFAULT_ID_LENGTH }).notNull(),
    type: varchar("type", { length: 255 }).$type<Account["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", {
      length: DEFAULT_ID_LENGTH,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("acc_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: DEFAULT_ID_LENGTH }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sesh_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const routes = pgTable("routes", {
  id: varchar("id", { length: DEFAULT_ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
});

export const routesRelations = relations(routes, ({ many }) => ({
  rounds: many(rounds, {
    relationName: "rounds",
  }),
}));

export const rounds = pgTable("rounds", {
  id: varchar("id", { length: DEFAULT_ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  routeId: varchar("route_id", { length: DEFAULT_ID_LENGTH }).notNull(),
  hint: varchar("hint", { length: 255 }),
  hintAnswer: varchar("hint_answer", { length: 255 }),
  keySegment: varchar("key_segment", { length: 255 }),
  sequence: integer("sequence"),
  finalHint: varchar("final_hint", { length: 255}),
});

export const roundsRelations = relations(rounds, ({ one, many }) => ({
  answers: many(answers, {
    relationName: "answers",
  }),
  route: one(routes, {
    fields: [rounds.routeId],
    references: [routes.id],
    relationName: "rounds",
  }),
}));

export const answers = pgTable("answers", {
  id: varchar("id", { length: DEFAULT_ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  answer: varchar("answer", { length: 255 }).notNull(),
  isRight: boolean("is_right")
    .default(sql`FALSE`)
    .notNull(),
  userId: varchar("user_id", { length: DEFAULT_ID_LENGTH }).notNull(),
  roundId: varchar("round_id", { length: DEFAULT_ID_LENGTH }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
    relationName: "userAnswers"
  }),
  round: one(rounds, {
    fields: [answers.roundId],
    references: [rounds.id],
    relationName: "answers"
  }),
}));
