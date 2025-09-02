import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import interviewRoutes from "./routes/interviewRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB()
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || "*"
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Routes
app.use("/api/interview", interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
