// controllers/interviewController.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Interview from "../models/Interview.js";

export const startInterview = async (req, res) => {
    try {
        const { domain, userMessage, userId, interviewId } = req.body;

        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        // Init Gemini model
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
        });

        // Build prompt
        // Build system prompt
//    const prompt = `
// You are an AI interviewer for the domain: ${domain}.
// Your role is to simulate a professional interview.

// Rules:
// 1. Ask interview questions ONLY (no prefixes like "Question 1:", "Q:", or numbering).
//    Just directly write the question.
// 2. Ask one question at a time.
// 3. After each user response, provide SHORT feedback only 
//    (1–2 sentences, e.g., "Good point, but you could also mention..." or "Correct, well explained").
// 4. Do NOT dive deeper into the same question or ask sub-questions.
// 5. After giving feedback, move directly to the next question.
// 6. Keep the flow natural, like a real interview.

// Conversation starts here:

// User: ${userMessage || "Start the interview"}
// `;
const prompt = `
You are an AI interviewer for the domain: ${domain}.
Your role is to simulate a professional, structured interview.

Rules:
1. Ask interview questions ONLY (no prefixes like "Question 1:", "Q:", or numbering). 
   Just directly write the question.
2. Ask **one question at a time**.
3. When the user answers:
   - Provide **short, constructive feedback** (1–2 sentences). 
     Example: "Good explanation, but you could also mention..." or "That's correct, well put."
   - Then, **immediately move to the next question** without waiting for further input.
4. Do NOT repeat, rephrase, or dive deeper into the same question. 
   Always progress to a new, relevant question.
5. Keep the flow **natural and conversational**, like a real interviewer.
6. End the interview politely once enough questions are covered (about 8–12).

Conversation starts here:

User: ${userMessage || "Start the interview"}
`;




        const response = await model.invoke(prompt);

        let interview;

        if (interviewId) {
            // 🔹 Append to existing interview
            interview = await Interview.findById(interviewId);
            if (!interview) {
                return res.status(404).json({ error: "Interview not found" });
            }

            interview.messages.push(
                { sender: "user", text: userMessage || "Start the interview" },
                { sender: "ai", text: response.content }
            );
            await interview.save();
        } else {
            // 🔹 Create new interview
            interview = await Interview.create({
                userId,
                domain,
                messages: [
                    { sender: "user", text: userMessage || "Start the interview" },
                    { sender: "ai", text: response.content },
                ],
            });
        }

        res.json(interview);
    } catch (error) {
        console.error("Interview Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};
