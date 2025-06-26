import { users, entries, type User, type InsertUser, type Entry, type InsertEntry } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private entries: Map<number, Entry>;
  private currentUserId: number;
  private currentEntryId: number;

  constructor() {
    this.users = new Map();
    this.entries = new Map();
    this.currentUserId = 1;
    this.currentEntryId = 1;
    
    // Add some initial entries for demonstration
    this.seedInitialEntries();
  }

  private seedInitialEntries() {
    const initialEntries: InsertEntry[] = [
      {
        title: "Completed Full-Stack Development Certification",
        content: "Successfully completed an intensive 6-month full-stack development program, mastering React, Node.js, and database management. This achievement marked a significant milestone in my transition to software development. The course covered everything from frontend frameworks to backend APIs, teaching me how to build complete web applications from scratch. I worked on several projects including an e-commerce platform and a social media dashboard, gaining hands-on experience with real-world development challenges.",
        excerpt: "Successfully completed an intensive 6-month full-stack development program, mastering React, Node.js, and database management. This achievement marked a significant milestone in my transition to software development...",
        category: "Achievement",
        date: "2024-03-15"
      },
      {
        title: "First Open Source Contribution Accepted",
        content: "My first meaningful contribution to an open source project was merged today! Contributing a performance optimization to a popular React component library. The experience taught me about collaborative coding and community engagement. I identified a performance bottleneck in the component rendering cycle and proposed a solution using React.memo and useMemo hooks. The maintainers were very welcoming and provided excellent feedback during the review process.",
        excerpt: "My first meaningful contribution to an open source project was merged today! Contributing a performance optimization to a popular React component library. The experience taught me about collaborative coding and community engagement...",
        category: "Career Milestone",
        date: "2024-01-08"
      },
      {
        title: "Attended First Tech Conference",
        content: "ReactConf 2023 was an incredible experience. Meeting fellow developers, learning about the latest React features, and networking with industry professionals opened my eyes to the broader tech community. I attended sessions on React Server Components, the new concurrent features, and best practices for building scalable applications. The networking opportunities were invaluable, and I made connections with developers from companies I admire.",
        excerpt: "ReactConf 2023 was an incredible experience. Meeting fellow developers, learning about the latest React features, and networking with industry professionals opened my eyes to the broader tech community...",
        category: "Learning Experience",
        date: "2023-11-22"
      },
      {
        title: "Launched My First Personal Project",
        content: "After months of planning and development, I finally launched my task management application. Built with React and Firebase, it represents my first complete full-stack project from conception to deployment. The app features real-time collaboration, drag-and-drop task organization, and user authentication. I learned so much about project management, user experience design, and deployment strategies during this journey.",
        excerpt: "After months of planning and development, I finally launched my task management application. Built with React and Firebase, it represents my first complete full-stack project from conception to deployment...",
        category: "Project Launch",
        date: "2023-09-10"
      }
    ];

    initialEntries.forEach(entry => {
      const newEntry: Entry = {
        id: this.currentEntryId++,
        ...entry,
        createdAt: new Date()
      };
      this.entries.set(newEntry.id, newEntry);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllEntries(): Promise<Entry[]> {
    return Array.from(this.entries.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    return this.entries.get(id);
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.currentEntryId++;
    const entry: Entry = {
      id,
      ...insertEntry,
      createdAt: new Date()
    };
    this.entries.set(id, entry);
    return entry;
  }

  async updateEntry(id: number, updateData: Partial<InsertEntry>): Promise<Entry | undefined> {
    const entry = this.entries.get(id);
    if (!entry) return undefined;

    const updatedEntry: Entry = {
      ...entry,
      ...updateData
    };
    this.entries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(id: number): Promise<boolean> {
    return this.entries.delete(id);
  }
}

export const storage = new MemStorage();
