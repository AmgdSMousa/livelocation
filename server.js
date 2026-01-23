const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, "data.json");

// تحميل البيانات القديمة من الملف
let sessions = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    sessions = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    sessions = {};
  }
}

// حفظ البيانات على الديسك
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
}

// استقبال مواقع المستخدمين
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const id = req.headers["x-session-id"];

  if (!id || lat === undefined || lng === undefined) {
    return res.json({ ok: false });
  }

  if (!sessions[id]) {
    sessions[id] = {
      createdAt: Date.now(),
      history: []
    };
  }

  const point = {
    lat,
    lng,
    accuracy,
    time: Date.now()
  };

  sessions[id].last = point;
  sessions[id].history.push(point);

  // حد أقصى للنقاط
  if (sessions[id].history.length > 500) {
    sessions[id].history.shift();
  }

  saveData();
  res.json({ ok: true });
});

// API لجلب كل الجلسات (قديمة + جديدة)
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// الصفحة الرئيسية
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
