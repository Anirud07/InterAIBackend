// models/Interview.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  domain: { type: String, required: true },
  messages: [messageSchema],
  ended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Interview", interviewSchema);
