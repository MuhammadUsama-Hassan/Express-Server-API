const users = require("./MOCK_DATA.json"); // Data from mockaroo.com
const express = require("express");
const fs = require("fs");
const app = express();
const log = console.log;
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware 1: Log to console
app.use((req, res, next) => {
  log("middleware1");
  next();
});

// Middleware 2: Log requests to a file
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.method}: ${req.path}\n`,
    (err) => {
      if (err) console.error("Error logging request:", err);
      next();
    }
  );
});

// GET all users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// User-specific routes (GET, PATCH, DELETE)
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user || { error: "User not found" });
  })
  .patch((req, res) => {
    // Edit user (placeholder)
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // Delete user (placeholder)
    return res.json({ status: "pending" });
  });

// POST: Add a new user
app.post("/api/users", (req, res) => {
  const body = req.body;
  const newUser = { ...body, id: users.length + 1 };
  users.push(newUser);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error saving data:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    return res.json({ status: "Success", user: newUser });
  });
});

// Start the server
app.listen(8000, () => log("Server Started on port 8000"));

