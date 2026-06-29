require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const flatRoutes = require("./routes/flatRoutes");
const choreRoutes = require("./routes/choreRoutes");
const eventRoutes = require("./routes/eventRoutes");


const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.use("/auth", authRoutes);
app.use("/flat", flatRoutes);
app.use("/chore", choreRoutes);
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ service: "roomrota-backend", status: "ok" });
});

const { notFound, errorHandler } = require("./middleware/errors");
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
