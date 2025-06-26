import { users, entries, type User, type InsertUser, type Entry, type InsertEntry } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEntries(): Promise<Entry[]>;
  getEntry(id: number): Promise<Entry | undefined>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  updateEntry(id: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllEntries(): Promise<Entry[]> {
    const allEntries = await db.select().from(entries).orderBy(desc(entries.date));
    return allEntries;
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    const [entry] = await db.select().from(entries).where(eq(entries.id, id));
    return entry || undefined;
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const [entry] = await db
      .insert(entries)
      .values({
        title: insertEntry.title,
        content: insertEntry.content,
        excerpt: insertEntry.excerpt || "",
        category: insertEntry.category,
        date: insertEntry.date,
        image: insertEntry.image || null
      })
      .returning();
    return entry;
  }

  async updateEntry(id: number, updateData: Partial<InsertEntry>): Promise<Entry | undefined> {
    const [entry] = await db
      .update(entries)
      .set(updateData)
      .where(eq(entries.id, id))
      .returning();
    return entry || undefined;
  }

  async deleteEntry(id: number): Promise<boolean> {
    const result = await db.delete(entries).where(eq(entries.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
