import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all entries
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getAllEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
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

  // Create new entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertEntrySchema.parse(req.body);
      
      // Generate excerpt from content (first 150 characters + ...)
      const excerpt = validatedData.content.length > 150 
        ? validatedData.content.substring(0, 150) + "..."
        : validatedData.content;
      
      const entryData = {
        ...validatedData,
        excerpt
      };
      
      const entry = await storage.createEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Update entry
  app.put("/api/entries/:id", async (req, res) => {
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

  // Delete entry
  app.delete("/api/entries/:id", async (req, res) => {
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
