import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertGuestSchema, insertTaskSchema, insertBudgetItemSchema, insertWeddingDetailsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Wedding details
  app.get("/api/wedding", async (req, res) => {
    try {
      const details = await storage.getWeddingDetails();
      res.json(details || null);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch wedding details" });
    }
  });

  app.patch("/api/wedding", async (req, res) => {
    try {
      const details = await storage.upsertWeddingDetails(req.body);
      res.json(details);
    } catch (e) {
      res.status(500).json({ error: "Failed to update wedding details" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const evts = await storage.getEvents();
      res.json(evts);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues });
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Guests
  app.get("/api/guests", async (req, res) => {
    try {
      const guestList = await storage.getGuests();
      res.json(guestList);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch guests" });
    }
  });

  app.post("/api/guests", async (req, res) => {
    try {
      const data = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(data);
      res.status(201).json(guest);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues });
      res.status(500).json({ error: "Failed to create guest" });
    }
  });

  app.post("/api/guests/rsvp", async (req, res) => {
    try {
      const data = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(data);
      res.status(201).json(guest);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues });
      res.status(500).json({ error: "Failed to submit RSVP" });
    }
  });

  app.patch("/api/guests/:id", async (req, res) => {
    try {
      const guest = await storage.updateGuest(req.params.id, req.body);
      if (!guest) return res.status(404).json({ error: "Guest not found" });
      res.json(guest);
    } catch (e) {
      res.status(500).json({ error: "Failed to update guest" });
    }
  });

  app.delete("/api/guests/:id", async (req, res) => {
    try {
      await storage.deleteGuest(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete guest" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const taskList = await storage.getTasks();
      res.json(taskList);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues });
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (e) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Budget
  app.get("/api/budget", async (req, res) => {
    try {
      const items = await storage.getBudgetItems();
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  });

  app.post("/api/budget", async (req, res) => {
    try {
      const data = insertBudgetItemSchema.parse(req.body);
      const item = await storage.createBudgetItem(data);
      res.status(201).json(item);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues });
      res.status(500).json({ error: "Failed to create budget item" });
    }
  });

  app.patch("/api/budget/:id", async (req, res) => {
    try {
      const item = await storage.updateBudgetItem(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: "Budget item not found" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: "Failed to update budget item" });
    }
  });

  app.delete("/api/budget/:id", async (req, res) => {
    try {
      await storage.deleteBudgetItem(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete budget item" });
    }
  });

  // Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const photos = await storage.getGalleryPhotos();
      res.json(photos);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const photo = await storage.createGalleryPhoto(req.body);
      res.status(201).json(photo);
    } catch (e) {
      res.status(500).json({ error: "Failed to add photo" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      await storage.deleteGalleryPhoto(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  // Reset endpoints
  app.delete("/api/reset/wedding", async (req, res) => {
    try {
      await storage.resetWeddingDetails();
      await storage.upsertWeddingDetails({
        brideName: "Shreya",
        groomName: "Vaibhav",
        weddingDate: "2026-07-11",
        venue: "Mangli Lake Farms",
        venueAddress: "Mangli Lake Farms, Wedding Venue",
        story: "Our love story began at a college festival in Pune, where Vaibhav played guitar on stage and Shreya couldn't take her eyes off him. Years of friendship blossomed into a love that feels like home. Join us as we begin our forever journey together.",
        hashtag: "#ShreyaWedVaibhav",
      });
      res.json({ success: true, message: "Wedding details reset and reseeded" });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset wedding details" });
    }
  });

  app.delete("/api/reset/events", async (req, res) => {
    try {
      await storage.resetEvents();
      res.json({ success: true, message: "All events reset" });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset events" });
    }
  });

  app.delete("/api/reset/guests", async (req, res) => {
    try {
      await storage.resetGuests();
      res.json({ success: true, message: "All guests reset" });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset guests" });
    }
  });

  app.delete("/api/reset/tasks", async (req, res) => {
    try {
      await storage.resetTasks();
      res.json({ success: true, message: "All tasks reset" });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset tasks" });
    }
  });

  app.delete("/api/reset/budget", async (req, res) => {
    try {
      await storage.resetBudgetItems();
      res.json({ success: true, message: "All budget items reset" });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset budget" });
    }
  });

  return httpServer;
}
