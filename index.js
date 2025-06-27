var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  entries: () => entries,
  insertEntrySchema: () => insertEntrySchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: text("is_admin").default("false").notNull()
});
var entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  image: text("image"),
  // Optional image field
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  createdAt: true,
  excerpt: true
}).extend({
  excerpt: z.string().optional()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createAdminUser(username, password) {
    const [user] = await db.insert(users).values({
      username,
      password,
      isAdmin: "true"
    }).returning();
    return user;
  }
  async getAllEntries() {
    const allEntries = await db.select().from(entries).orderBy(desc(entries.date));
    return allEntries;
  }
  async getEntry(id) {
    const [entry] = await db.select().from(entries).where(eq(entries.id, id));
    return entry || void 0;
  }
  async createEntry(insertEntry) {
    const [entry] = await db.insert(entries).values({
      title: insertEntry.title,
      content: insertEntry.content,
      excerpt: insertEntry.excerpt || "",
      category: insertEntry.category,
      date: insertEntry.date,
      image: insertEntry.image || null
    }).returning();
    return entry;
  }
  async updateEntry(id, updateData) {
    const [entry] = await db.update(entries).set(updateData).where(eq(entries.id, id)).returning();
    return entry || void 0;
  }
  async deleteEntry(id) {
    const result = await db.delete(entries).where(eq(entries.id, id));
    return (result.rowCount ?? 0) > 0;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";

// server/auth.ts
import bcrypt from "bcrypt";
import session from "express-session";
function setupSession(app2) {
  app2.use(session({
    secret: process.env.SESSION_SECRET || "journal-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  }));
}
var requireAuth = async (req, res, next) => {
  if (!req.session.isAuthenticated || !req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// server/routes.ts
async function registerRoutes(app2) {
  setupSession(app2);
  app2.post("/api/auth/login", async (req, res) => {
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
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/auth/status", (req, res) => {
    res.json({
      isAuthenticated: req.session.isAuthenticated || false,
      isAdmin: req.session.isAdmin || false,
      userId: req.session.userId || null
    });
  });
  app2.post("/api/auth/setup", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
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
  app2.get("/api/entries", async (req, res) => {
    try {
      const entries2 = await storage.getAllEntries();
      res.json(entries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });
  app2.get("/api/public/entries", async (req, res) => {
    try {
      const entries2 = await storage.getAllEntries();
      res.json({
        entries: entries2,
        isPublic: true,
        message: "Public view - read only access"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public entries" });
    }
  });
  app2.get("/api/portfolio/entries", async (req, res) => {
    try {
      const entries2 = await storage.getAllEntries();
      res.json({
        entries: entries2,
        isPublic: true,
        message: "Professional portfolio view"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio entries" });
    }
  });
  app2.get("/api/timeline/entries", async (req, res) => {
    try {
      const entries2 = await storage.getAllEntries();
      res.json({
        entries: entries2,
        isPublic: true,
        message: "Professional timeline view"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline entries" });
    }
  });
  app2.get("/api/entries/:id", async (req, res) => {
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
  app2.post("/api/entries", requireAuth, async (req, res) => {
    try {
      const data = req.body;
      const excerpt = data.excerpt || (data.content && data.content.length > 150 ? data.content.substring(0, 150) + "..." : data.content || "");
      const entryWithExcerpt = {
        ...data,
        excerpt
      };
      const validatedData = insertEntrySchema.parse(entryWithExcerpt);
      const entry = await storage.createEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid entry data",
          errors: error.errors
        });
      }
      console.error("Create entry error:", error);
      res.status(500).json({ message: "Failed to create entry" });
    }
  });
  app2.put("/api/entries/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }
      const validatedData = insertEntrySchema.partial().parse(req.body);
      if (validatedData.content) {
        validatedData.excerpt = validatedData.content.length > 150 ? validatedData.content.substring(0, 150) + "..." : validatedData.content;
      }
      const entry = await storage.updateEntry(id, validatedData);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid entry data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update entry" });
    }
  });
  app2.delete("/api/entries/:id", requireAuth, async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/my-vite-web/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
