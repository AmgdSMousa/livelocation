const express = require("express");
const app = express();

app.use(express.json());

// API تستقبل اللوكيشن
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;

  console.log("LIVE LOCATION:");
  console.log(`Lat: ${lat}, Lng: ${lng}`);
  console.log(`Accuracy: ${accuracy}m`);

  const maps = `https://www.google.com/maps?q=${lat},${lng}`;
  res.json({ maps });
});

// Render يستخدم PORT تلقائي
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
