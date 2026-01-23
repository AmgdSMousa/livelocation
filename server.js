const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// تخزين الجلسات والمسار
const sessions = {};

// استقبال مواقع المستخدمين
app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const id = req.headers["x-session-id"];

  if (!id || lat === undefined || lng === undefined) {
    return res.json({ ok: false });
  }

  if (!sessions[id]) {
    sessions[id] = { history: [] };
  }

  const point = {
    lat,
    lng,
    accuracy,
    time: Date.now()
  };

  sessions[id].last = point;
  sessions[id].history.push(point);

  // احتفظ بآخر 300 نقطة فقط
  if (sessions[id].history.length > 300) {
    sessions[id].history.shift();
  }

  res.json({ ok: true });
});

// API لجلب كل الجلسات
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

// تنظيف الجلسات غير النشطة
setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(id => {
    if (now - sessions[id].last.time > 5 * 60 * 1000) {
      delete sessions[id];
    }
  });
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
