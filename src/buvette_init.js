//Run this in terminal using : mongosh buvette_init.js 
 
// Use the buvette database
const db = connect("mongodb://localhost:27017/buvette");

// --- MENU ITEMS ---
const menuItems = [
  {
    name: "Cheeseburger",
    price: 25,
    rating: 4.5,
    image: "img/buger.jpeg",
    itemCategory: "SANDWICH"
  },
  {
    name: "French Fries",
    price: 12,
    rating: 4.2,
    image: "img/Pepperoni-Pizza700x700.jpeg",
    itemCategory: "SNACK"
  },
  {
    name: "Orange Juice",
    price: 8,
    rating: 4,
    image: "img/pizza2.jpeg",
    itemCategory: "DRINK"
  }
];

// Create collection if not exists
if (!db.getCollectionNames().includes("menu_items")) {
  db.createCollection("menu_items");
}

// Insert menu items if they don't exist (based on name)
menuItems.forEach(item => {
  const exists = db.menu_items.findOne({ name: item.name });
  if (!exists) {
    db.menu_items.insertOne(item);
  }
});

// --- FAVORITES ---
if (!db.getCollectionNames().includes("favorites")) {
  db.createCollection("favorites");
}

// --- USERS ---
if (!db.getCollectionNames().includes("users")) {
  db.createCollection("users");
}

print("Database initialized successfully!");
