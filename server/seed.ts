import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Check if wedding details already exist
    const existing = await storage.getWeddingDetails();
    if (existing) return;

    console.log("Seeding database with initial data...");

    // Seed wedding details
    await storage.upsertWeddingDetails({
      brideName: "Priya",
      groomName: "Arjun",
      weddingDate: "2025-12-20",
      venue: "The Grand Palace, Mumbai",
      venueAddress: "123 Celebration Avenue, Bandra West, Mumbai, Maharashtra 400050",
      story: "Our love story began at a college festival in Pune, where Arjun played guitar on stage and Priya couldn't take her eyes off him. Years of friendship blossomed into a love that feels like home. Join us as we begin our forever journey together.",
      hashtag: "#PriyaWedArjun",
    });

    // Seed events
    const eventsList = [
      { name: "Haldi Ceremony", type: "haldi", date: "2025-12-17", time: "10:00 AM", venue: "Sharma Residence, Pune", description: "A sacred ceremony where turmeric paste is applied to the bride and groom by family members to bless them with prosperity and a glowing start to married life.", dresscode: "Yellow / Orange attire", sortOrder: 1 },
      { name: "Mehendi Night", type: "mehendi", date: "2025-12-18", time: "4:00 PM", venue: "The Garden Pavilion, Pune", description: "An evening of intricate henna artistry, music, dancing, and celebration as beautiful patterns are applied to the bride's hands and feet.", dresscode: "Green / Pink ethnic wear", sortOrder: 2 },
      { name: "Sangeet Night", type: "sangeet", date: "2025-12-18", time: "7:30 PM", venue: "The Grand Palace Ballroom, Mumbai", description: "A glamorous evening of music, dance performances by family and friends, and heartfelt celebrations to welcome the joining of two families.", dresscode: "Cocktail / Festive attire", sortOrder: 3 },
      { name: "Wedding Ceremony", type: "wedding", date: "2025-12-20", time: "10:30 AM", venue: "The Grand Temple Hall, Mumbai", description: "The sacred union of Priya and Arjun in a traditional Hindu ceremony filled with ancient rituals, vows, and the blessing of loved ones.", dresscode: "Traditional Indian formal attire", sortOrder: 4 },
      { name: "Reception", type: "reception", date: "2025-12-20", time: "7:00 PM", venue: "The Grand Palace Banquet, Mumbai", description: "Join us for an elegant reception dinner to celebrate the newly married couple. An evening of fine dining, dancing, and joyful memories.", dresscode: "Formal / Black tie", sortOrder: 5 },
    ];

    for (const event of eventsList) {
      await storage.createEvent(event);
    }

    // Seed guests
    const guestsList = [
      { name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", side: "groom", rsvpStatus: "confirmed", mealPreference: "vegetarian", tableNumber: "T1", plusOne: true, notes: "Childhood friend of groom" },
      { name: "Ananya Patel", email: "ananya@example.com", phone: "+91 9876543211", side: "bride", rsvpStatus: "confirmed", mealPreference: "jain", tableNumber: "T2", plusOne: false, notes: "" },
      { name: "Vivek Mehta", email: "vivek@example.com", phone: "+91 9876543212", side: "both", rsvpStatus: "confirmed", mealPreference: "non-vegetarian", tableNumber: "T3", plusOne: true, notes: "" },
      { name: "Deepa Nair", email: "deepa@example.com", phone: "+91 9876543213", side: "bride", rsvpStatus: "pending", mealPreference: "vegetarian", tableNumber: "", plusOne: false, notes: "Awaiting confirmation" },
      { name: "Karan Singh", email: "karan@example.com", phone: "+91 9876543214", side: "groom", rsvpStatus: "confirmed", mealPreference: "vegetarian", tableNumber: "T1", plusOne: false, notes: "" },
      { name: "Pooja Gupta", email: "pooja@example.com", phone: "+91 9876543215", side: "bride", rsvpStatus: "declined", mealPreference: "vegan", tableNumber: "", plusOne: false, notes: "Will be traveling abroad" },
      { name: "Sanjay Verma", email: "sanjay@example.com", phone: "+91 9876543216", side: "groom", rsvpStatus: "maybe", mealPreference: "non-vegetarian", tableNumber: "", plusOne: true, notes: "" },
    ];

    for (const guest of guestsList) {
      await storage.createGuest(guest as any);
    }

    // Seed tasks
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

    // Seed budget items
    const budgetList = [
      { category: "venue", vendor: "The Grand Palace", description: "Main wedding venue booking", plannedAmount: 500000, actualAmount: 480000, paid: true, notes: "Includes catering hall" },
      { category: "catering", vendor: "Royal Feast Caterers", description: "Food and beverages for all events", plannedAmount: 300000, actualAmount: 285000, paid: false, notes: "Payment due 2 weeks before" },
      { category: "photography", vendor: "Moments Studio", description: "Photo and video coverage", plannedAmount: 150000, actualAmount: 150000, paid: true, notes: "Includes same-day edit highlight reel" },
      { category: "decor", vendor: "Floral Dreams", description: "Floral and stage decoration", plannedAmount: 200000, actualAmount: 210000, paid: false, notes: "Slightly over budget due to extra flowers" },
      { category: "attire", vendor: "Sabyasachi Boutique", description: "Bride's wedding lehenga and jewelry", plannedAmount: 250000, actualAmount: 240000, paid: true, notes: "" },
      { category: "music", vendor: "DJ Raj Events", description: "DJ and band for sangeet and reception", plannedAmount: 80000, actualAmount: 75000, paid: false, notes: "" },
      { category: "invitations", vendor: "Elegance Print Studio", description: "Wedding invitation printing", plannedAmount: 30000, actualAmount: 28000, paid: true, notes: "200 cards printed" },
      { category: "honeymoon", vendor: "Maldives Resort & Spa", description: "7-night honeymoon package", plannedAmount: 200000, actualAmount: 0, paid: false, notes: "To be booked" },
    ];

    for (const item of budgetList) {
      await storage.createBudgetItem(item as any);
    }

    // Seed gallery photos (using Picsum for demo)
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

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
