import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import reportRoutes from "./routes/reportRoutes";
import alertRoutes from "./routes/alertRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI || "";

/* -------------------- DEBUG LOGGER -------------------- */
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin}`
  );
  next();
});

/* -------------------- CORS SETUP -------------------- */

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://floodsense23.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



app.use(express.json());

/* -------------------- DATABASE -------------------- */

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("FloodSense Backend is running!");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* -------------------- SERVER -------------------- */

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});