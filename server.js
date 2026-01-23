const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const maps = `https://www.google.com/maps?q=${lat},${lng}`;
  res.json({ maps });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
