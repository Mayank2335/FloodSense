import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;
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
  "https://floodsense23.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("Not allowed by CORS"), false);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 REQUIRED FOR PREFLIGHT REQUESTS
// In Express 5, the '*' path syntax can cause issues. 
// Since we are using app.use(cors({...})) globally above, this handles OPTIONS requests automatically.
// If explicit OPTIONS handling is needed, use a regex or handle it specifically.
// app.options("*", cors()); // REMOVED to fix "Missing parameter name at index 1" error

/* -------------------- MIDDLEWARE -------------------- */

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
