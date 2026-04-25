const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const FILE_PATH = path.join(__dirname, "../stats.json");

app.get("/stats", (req, res) => {
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "stats.json not found" });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

app.listen(5000, () => {
  console.log("API running on http://localhost:5000");
});