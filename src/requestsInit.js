// Use the buvette database
const db = connect("mongodb://localhost:27017/buvette");

// --- REQUESTS WORKERS ---
const requestsWorkers = [
  { firstName: "Ahlam", lastName: "Halima", email: "ahlam@gmail.com", status: "PENDING", createdAt: new Date() },
  { firstName: "Karim", lastName: "Sami", email: "karim@gmail.com", status: "APPROVED", createdAt: new Date() },
  { firstName: "Lina", lastName: "Boutaleb", email: "lina@gmail.com", status: "REJECTED", createdAt: new Date() },
  { firstName: "Sara", lastName: "Moulay", email: "sara@gmail.com", status: "APPROVED", createdAt: new Date() },
  { firstName: "Omar", lastName: "Benali", email: "omar@gmail.com", status: "PENDING", createdAt: new Date() }
];

// Create collection if not exists
if (!db.getCollectionNames().includes("requests_workers")) {
  db.createCollection("requests_workers");
}

// Insert requests workers if they don't exist (based on email)
requestsWorkers.forEach(worker => {
  const exists = db.requests_workers.findOne({ email: worker.email });
  if (!exists) {
    db.requests_workers.insertOne(worker);
  }
});

print("Requests_workers collection initialized successfully!");