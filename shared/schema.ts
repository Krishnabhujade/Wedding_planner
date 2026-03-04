import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const weddingDetails = pgTable("wedding_details", {
  id: integer("id").primaryKey().default(1),
  brideName: text("bride_name").notNull().default("Shreya"),
  groomName: text("groom_name").notNull().default("Vaibhav"),
  weddingDate: text("wedding_date").notNull().default("2026-07-11"),
  venue: text("venue").notNull().default("Mangli Lake Farms"),
  venueAddress: text("venue_address").notNull().default("Mangli Lake Farms, Wedding Venue"),
  story: text("story").notNull().default("Our love story began under the stars and will be sealed forever with your blessings."),
  hashtag: text("hashtag").notNull().default("#ShreyaWedVaibhav"),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  venue: text("venue").notNull(),
  description: text("description").notNull().default(""),
  dresscode: text("dresscode").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const guests = pgTable("guests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  side: text("side").notNull().default("both"),
  rsvpStatus: text("rsvp_status").notNull().default("pending"),
  mealPreference: text("meal_preference").notNull().default("vegetarian"),
  tableNumber: text("table_number").notNull().default(""),
  plusOne: boolean("plus_one").notNull().default(false),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("general"),
  status: text("status").notNull().default("pending"),
  dueDate: text("due_date").notNull().default(""),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgetItems = pgTable("budget_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  vendor: text("vendor").notNull().default(""),
  description: text("description").notNull().default(""),
  plannedAmount: real("planned_amount").notNull().default(0),
  actualAmount: real("actual_amount").notNull().default(0),
  paid: boolean("paid").notNull().default(false),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  category: text("category").notNull().default("general"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export const insertWeddingDetailsSchema = createInsertSchema(weddingDetails).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true, createdAt: true });
export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotos).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WeddingDetails = typeof weddingDetails.$inferSelect;
export type InsertWeddingDetails = z.infer<typeof insertWeddingDetailsSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
