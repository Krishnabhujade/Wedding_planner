import {
  type User, type InsertUser,
  type WeddingDetails, type InsertWeddingDetails,
  type Event, type InsertEvent,
  type Guest, type InsertGuest,
  type Task, type InsertTask,
  type BudgetItem, type InsertBudgetItem,
  type GalleryPhoto, type InsertGalleryPhoto,
  users, weddingDetails, events, guests, tasks, budgetItems, galleryPhotos,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getWeddingDetails(): Promise<WeddingDetails | undefined>;
  upsertWeddingDetails(data: Partial<InsertWeddingDetails>): Promise<WeddingDetails>;

  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  getGuests(): Promise<Guest[]>;
  getGuest(id: string): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: string): Promise<void>;

  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;

  getBudgetItems(): Promise<BudgetItem[]>;
  getBudgetItem(id: string): Promise<BudgetItem | undefined>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItem(id: string, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined>;
  deleteBudgetItem(id: string): Promise<void>;

  getGalleryPhotos(): Promise<GalleryPhoto[]>;
  createGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;
  deleteGalleryPhoto(id: string): Promise<void>;

  resetWeddingDetails(): Promise<void>;
  resetEvents(): Promise<void>;
  resetGuests(): Promise<void>;
  resetTasks(): Promise<void>;
  resetBudgetItems(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWeddingDetails(): Promise<WeddingDetails | undefined> {
    const [details] = await db.select().from(weddingDetails);
    return details;
  }

  async upsertWeddingDetails(data: Partial<InsertWeddingDetails>): Promise<WeddingDetails> {
    const existing = await this.getWeddingDetails();
    if (existing) {
      const [updated] = await db.update(weddingDetails).set(data).where(eq(weddingDetails.id, 1)).returning();
      return updated;
    } else {
      const [created] = await db.insert(weddingDetails).values({ id: 1, ...data } as any).returning();
      return created;
    }
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(events.sortOrder, events.date);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getGuests(): Promise<Guest[]> {
    return db.select().from(guests).orderBy(desc(guests.createdAt));
  }

  async getGuest(id: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest;
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const [created] = await db.insert(guests).values(guest).returning();
    return created;
  }

  async updateGuest(id: string, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const [updated] = await db.update(guests).set(guest).where(eq(guests.id, id)).returning();
    return updated;
  }

  async deleteGuest(id: string): Promise<void> {
    await db.delete(guests).where(eq(guests.id, id));
  }

  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getBudgetItems(): Promise<BudgetItem[]> {
    return db.select().from(budgetItems).orderBy(desc(budgetItems.createdAt));
  }

  async getBudgetItem(id: string): Promise<BudgetItem | undefined> {
    const [item] = await db.select().from(budgetItems).where(eq(budgetItems.id, id));
    return item;
  }

  async createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem> {
    const [created] = await db.insert(budgetItems).values(item).returning();
    return created;
  }

  async updateBudgetItem(id: string, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined> {
    const [updated] = await db.update(budgetItems).set(item).where(eq(budgetItems.id, id)).returning();
    return updated;
  }

  async deleteBudgetItem(id: string): Promise<void> {
    await db.delete(budgetItems).where(eq(budgetItems.id, id));
  }

  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return db.select().from(galleryPhotos).orderBy(galleryPhotos.sortOrder);
  }

  async createGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const [created] = await db.insert(galleryPhotos).values(photo).returning();
    return created;
  }

  async deleteGalleryPhoto(id: string): Promise<void> {
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  }

  async resetWeddingDetails(): Promise<void> {
    await db.delete(weddingDetails);
  }

  async resetEvents(): Promise<void> {
    await db.delete(events);
  }

  async resetGuests(): Promise<void> {
    await db.delete(guests);
  }

  async resetTasks(): Promise<void> {
    await db.delete(tasks);
  }

  async resetBudgetItems(): Promise<void> {
    await db.delete(budgetItems);
  }
}

export const storage = new DatabaseStorage();
