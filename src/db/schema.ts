import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").default("unset").notNull()
});

export type NewUser = typeof users.$inferInsert; // user data input
export type User = typeof users.$inferSelect // user data output

export const chirps = pgTable("chirps",{
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  body: text("body").notNull(),
  userId: uuid("userId").references(() => users.id, {onDelete: 'cascade'}).notNull(),
}) 

export const refresh_tokens = pgTable("refresh_tokens",{
  token: text("token").primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  userId: uuid("userId").references(() => users.id, {onDelete: 'cascade'}).notNull(), 
  expiresAt: timestamp("expires_at").notNull(), //cant be null or it would be access till revoked
  revokedAt: timestamp("revoked_at") //defaults to null if none provided at creation
}) 
