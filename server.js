const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // يخدم static files (html, css, js)

let sessions = {};

// استقبال موقع جديد
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const sessionId = req.headers["x-session-id"];
  if (sessionId && lat && lng) {
    sessions[sessionId] = { lat, lng, accuracy, time: Date.now() };
  }
  res.json({ ok: true });
});

// API لقراءة كل المواقع
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// صفحة البداية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// صفحة الداشبورد
app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
