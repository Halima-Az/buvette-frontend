//Run this in terminal using : mongosh buvette_init.js 
 
// Use the buvette database
const db = connect("mongodb://localhost:27017/buvette");

// --- MENU ITEMS ---
const menuItems = [
   // 🥪 SANDWICHES
  { name: "Cheeseburger", price: 25, rating: 4.5, image: "img/buger.jpeg", itemCategory: "SANDWICH" },
  { name: "Chicken Burger", price: 28, rating: 4.6, image: "img/chicken_burger.png", itemCategory: "SANDWICH" },
  { name: "Double Beef Burger", price: 35, rating: 4.8, image: "img/double_beef.png", itemCategory: "SANDWICH" },
  { name: "Tuna Sandwich", price: 20, rating: 4.1, image: "img/tuna.png", itemCategory: "SANDWICH" },
  { name: "Club Sandwich", price: 30, rating: 4.4, image: "img/club.png", itemCategory: "SANDWICH" },
  { name: "Hot Dog", price: 18, rating: 4.0, image: "img/hotdog.png", itemCategory: "SANDWICH" },

  // 🍕 FAST FOOD
  { name: "Pepperoni Pizza", price: 40, rating: 4.7, image: "img/pepperoni.png", itemCategory: "SNACK" },
  { name: "Margherita Pizza", price: 35, rating: 4.3, image: "img/margherita.jpeg", itemCategory: "SNACK" },
  { name: "Mini Pizza", price: 22, rating: 4.0, image: "img/mini_pizza.jpeg", itemCategory: "SNACK" },
  { name: "Tacos Poulet", price: 30, rating: 4.5, image: "img/tacos_poulet.png", itemCategory: "SNACK" },
  { name: "Tacos Viande", price: 32, rating: 4.6, image: "img/tacos_viande.png", itemCategory: "SNACK" },
 
  // 🍟 SNACKS
  { name: "French Fries", price: 12, rating: 4.2, image: "img/fries.jpeg", itemCategory: "SNACK" },
  { name: "Cheese Fries", price: 15, rating: 4.4, image: "img/cheese_fries.jpeg", itemCategory: "SNACK" },
  { name: "Chicken Nuggets", price: 20, rating: 4.5, image: "img/nuggets.jpeg", itemCategory: "SNACK" },
  { name: "Onion Rings", price: 14, rating: 4.1, image: "img/onion_rings.jpeg", itemCategory: "SNACK" },

  // 🥤 DRINKS
  { name: "Orange Juice", price: 8, rating: 4.0, image: "img/orange_juice.jpeg", itemCategory: "DRINK" },
  { name: "Apple Juice", price: 8, rating: 4.1, image: "img/apple_juice.jpeg", itemCategory: "DRINK" },
  { name: "Cola", price: 7, rating: 4.3, image: "img/cola.jpeg", itemCategory: "DRINK" },
  { name: "Fanta", price: 7, rating: 4.2, image: "img/fanta.jpeg", itemCategory: "DRINK" },
  { name: "Mineral Water", price: 5, rating: 4.0, image: "img/water.jpeg", itemCategory: "DRINK" },
  { name: "Ice Tea", price: 9, rating: 4.4, image: "img/icetea.jpeg", itemCategory: "DRINK" },

  // ☕ HOT DRINKS
  { name: "Espresso", price: 6, rating: 4.6, image: "img/espresso.jpeg", itemCategory: "DRINK" },
  { name: "Cappuccino", price: 10, rating: 4.7, image: "img/cappuccino.jpeg", itemCategory: "DRINK" },
  { name: "Latte", price: 11, rating: 4.5, image: "img/latte.jpeg", itemCategory: "DRINK" },
  { name: "Tea", price: 6, rating: 4.2, image: "img/tea.jpeg", itemCategory: "DRINK" },

  // 🍰 DESSERTS
  { name: "Chocolate Cake", price: 18, rating: 4.8, image: "img/chocolate_cake.jpeg", itemCategory: "DESSERT" },
  { name: "Cheesecake", price: 20, rating: 4.7, image: "img/cheesecake.jpeg", itemCategory: "DESSERT" },
  { name: "Donut", price: 6, rating: 4.1, image: "img/donut.jpeg", itemCategory: "DESSERT" },
  { name: "Croissant", price: 5, rating: 4.3, image: "img/croissant.jpeg", itemCategory: "DESSERT" }
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
