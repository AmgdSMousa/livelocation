const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// يخدم ملفات HTML
app.use(express.static(__dirname));

// API
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;

  console.log("LIVE LOCATION");
  console.log(lat, lng, accuracy);

  const maps = `https://www.google.com/maps?q=${lat},${lng}`;
  res.json({ maps });
});

// fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
