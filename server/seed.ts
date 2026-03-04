import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("Seeding database with initial data...");

    // Seed wedding details (only if none exist)
    const existingWedding = await storage.getWeddingDetails();
    if (!existingWedding) {
      await storage.upsertWeddingDetails({
        brideName: "Shreya",
        groomName: "Vaibhav",
        weddingDate: "2026-07-11",
        venue: "Mangli Lake Farms",
        venueAddress: "Mangli Lake Farms, Wedding Venue",
        story: "Our love story began at a college festival in Pune, where Vaibhav played guitar on stage and Shreya couldn't take her eyes off him. Years of friendship blossomed into a love that feels like home. Join us as we begin our forever journey together.",
        hashtag: "#ShreyaWedVaibhav",
      });
    }

    // Seed events (only if none exist)
    const existingEvents = await storage.getEvents();
    if (existingEvents.length === 0) {
      const eventsList = [
      { name: "Mehendi Ceremony", type: "mehendi", date: "2026-07-09", time: "5:00 PM", venue: "At respective houses", description: "An evening of intricate henna artistry, music, dancing, and celebration as beautiful patterns are applied to the bride's hands and feet.", dresscode: "Green / Pink ethnic wear", sortOrder: 1 },
      { name: "Haldi Ceremony", type: "haldi", date: "2026-07-10", time: "12:00 PM", venue: "Mangli Lake Farms", description: "A sacred ceremony where turmeric paste is applied to the bride and groom by family members to bless them with prosperity and a glowing start to married life.", dresscode: "Yellow / Orange attire", sortOrder: 2 },
      { name: "Sangeet Night", type: "sangeet", date: "2026-07-10", time: "6:00 PM", venue: "Mangli Lake Farms", description: "A glamorous evening of music, dance performances by family and friends, and heartfelt celebrations to welcome the joining of two families.", dresscode: "Cocktail / Festive attire", sortOrder: 3 },
      { name: "Wedding Ceremony", type: "wedding", date: "2026-07-11", time: "12:04 PM", venue: "Mangli Lake Farms", description: "The sacred union of Shreya and Vaibhav in a traditional Hindu ceremony filled with ancient rituals, vows, and the blessing of loved ones.", dresscode: "Traditional Indian formal attire", sortOrder: 4 },
      { name: "Reception", type: "reception", date: "2026-07-12", time: "7:00 PM", venue: "Bougainvillea Banquet", description: "Join us for an elegant reception dinner to celebrate the newly married couple. An evening of fine dining, dancing, and joyful memories.", dresscode: "Formal / Black tie", sortOrder: 5 },
    ];

    for (const event of eventsList) {
      await storage.createEvent(event);
    }
    }

    // Seed tasks (only if none exist)
    const existingTasks = await storage.getTasks();
    if (existingTasks.length === 0) {
      const tasksList = [
      { title: "Book wedding venue", description: "Finalize and sign contract with The Grand Palace", category: "venue", status: "completed", dueDate: "2025-09-01", priority: "high" },
      { title: "Hire wedding photographer", description: "Book experienced photographer for all events", category: "photography", status: "completed", dueDate: "2025-09-15", priority: "high" },
      { title: "Order wedding lehenga", description: "Visit designer studio for bride's outfit fitting", category: "attire", status: "in-progress", dueDate: "2025-10-15", priority: "high" },
      { title: "Finalize catering menu", description: "Select dishes for all events with caterer", category: "catering", status: "in-progress", dueDate: "2025-11-01", priority: "high" },
      { title: "Send wedding invitations", description: "Print and mail physical invitations to all guests", category: "invitations", status: "completed", dueDate: "2025-10-01", priority: "medium" },
      { title: "Book honeymoon hotel", description: "Reserve Maldives resort for 7 nights", category: "honeymoon", status: "pending", dueDate: "2025-11-15", priority: "medium" },
      { title: "Arrange floral decoration", description: "Confirm flower arrangements with decorator for all venues", category: "decor", status: "pending", dueDate: "2025-11-20", priority: "medium" },
      { title: "Book DJ and live band", description: "Confirm entertainment for sangeet and reception", category: "music", status: "in-progress", dueDate: "2025-10-30", priority: "medium" },
      { title: "Mehendi artist booking", description: "Book experienced mehendi artist for ceremony", category: "attire", status: "completed", dueDate: "2025-10-01", priority: "medium" },
      { title: "Organize bridal makeup trial", description: "Schedule trial session with makeup artist", category: "attire", status: "pending", dueDate: "2025-11-25", priority: "low" },
    ];

    for (const task of tasksList) {
      await storage.createTask(task as any);
    }
    }

    // Seed gallery photos (only if none exist)
    const existingPhotos = await storage.getGalleryPhotos();
    if (existingPhotos.length === 0) {
      const photoList = [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", caption: "Forever begins here", category: "ceremony", sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80", caption: "A love like no other", category: "pre-wedding", sortOrder: 2 },
      { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", caption: "Sangeet night magic", category: "reception", sortOrder: 3 },
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", caption: "Mehendi artistry", category: "ceremony", sortOrder: 4 },
      { url: "https://images.unsplash.com/photo-1553415923-3a1ea0c5f7b0?w=600&q=80", caption: "Beautiful traditions", category: "pre-wedding", sortOrder: 5 },
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80", caption: "Moments of joy", category: "candid", sortOrder: 6 },
    ];

    for (const photo of photoList) {
      await storage.createGalleryPhoto(photo as any);
    }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
