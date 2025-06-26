import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema } from "@shared/schema";
import { z } from "zod";
import { setupSession, requireAuth, isAuthenticated, hashPassword, verifyPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  setupSession(app);

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.isAuthenticated = true;
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin === "true";

      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          username: user.username, 
          isAdmin: user.isAdmin === "true" 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    res.json({
      isAuthenticated: req.session.isAuthenticated || false,
      isAdmin: req.session.isAdmin || false,
      userId: req.session.userId || null
    });
  });

  // Setup admin user if none exists
  app.post("/api/auth/setup", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // Check if admin already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createAdminUser(username, hashedPassword);
      
      res.json({ message: "Admin user created successfully", userId: user.id });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Setup failed" });
    }
  });

  // Get all entries (public access)
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getAllEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Public sharing endpoint - get all entries with read-only access
  app.get("/api/public/entries", async (req, res) => {
    try {
      const entries = await storage.getAllEntries();
      res.json({
        entries,
        isPublic: true,
        message: "Public view - read only access"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public entries" });
    }
  });

  // Professional portfolio routes with trustworthy URLs
  app.get("/api/portfolio/entries", async (req, res) => {
    try {
      const entries = await storage.getAllEntries();
      res.json({
        entries,
        isPublic: true,
        message: "Professional portfolio view"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio entries" });
    }
  });

  app.get("/api/timeline/entries", async (req, res) => {
    try {
      const entries = await storage.getAllEntries();
      res.json({
        entries,
        isPublic: true,
        message: "Professional timeline view"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline entries" });
    }
  });

  // Get single entry
  app.get("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const entry = await storage.getEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Create new entry (admin only)
  app.post("/api/entries", requireAuth, async (req, res) => {
    try {
      const data = req.body;
      
      // Generate excerpt from content if not provided
      const excerpt = data.excerpt || (data.content && data.content.length > 150 
        ? data.content.substring(0, 150) + "..."
        : data.content || "");
      
      const entryWithExcerpt = {
        ...data,
        excerpt
      };
      
      const validatedData = insertEntrySchema.parse(entryWithExcerpt);
      const entry = await storage.createEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: error.errors 
        });
      }
      console.error("Create entry error:", error);
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Update entry (admin only)
  app.put("/api/entries/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const validatedData = insertEntrySchema.partial().parse(req.body);
      
      // Update excerpt if content is being updated
      if (validatedData.content) {
        validatedData.excerpt = validatedData.content.length > 150 
          ? validatedData.content.substring(0, 150) + "..."
          : validatedData.content;
      }
      
      const entry = await storage.updateEntry(id, validatedData);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update entry" });
    }
  });

  // Delete entry (admin only)
  app.delete("/api/entries/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const deleted = await storage.deleteEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
