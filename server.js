const sessions = {};

app.post("/api/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  const id = req.headers["x-session-id"];

  if (id) {
    sessions[id] = {
      lat,
      lng,
      accuracy,
      time: Date.now()
    };
  }

  res.json({ ok: true });
});

app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});
