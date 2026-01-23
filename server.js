const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const sessions = {};

// استقبال الموقع
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const id = req.headers["x-session-id"];

  if (id && lat && lng) {
    sessions[id] = {
      lat,
      lng,
      accuracy,
      time: Date.now()
    };
  }

  res.json({ ok: true });
});

// API للـ dashboard
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
