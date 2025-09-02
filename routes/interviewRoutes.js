import express from "express";
import { startInterview } from "../controllers/interviewController.js";
import Interview from "../models/Interview.js";

const router = express.Router();

// Start or continue interview
router.post("/start", startInterview);

// Get user history
router.get("/history/:userId", async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// End interview
router.post("/end/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: "Interview not found" });

    interview.ended = true;
    interview.messages.push({
      sender: "ai",
      text: "✅ Thank you! The interview has ended.",
    });
    await interview.save();

    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
