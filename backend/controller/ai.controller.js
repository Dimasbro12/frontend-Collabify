const axios = require("axios");
const AIMessage = require("../models/aiMessage.model");

const askAI = async (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and userId are required" });
  }

  try {
    // Example API call to AI (change to your real endpoint)
    const response = await axios.post("http://localhost:8080/api/ai/ask", { 
      prompt,
      userId
     });
    const aiReply = response.data.reply;

    // Save to DB
    const saved = await AIMessage.create({
      user: userId,
      prompt,
      reply: aiReply,
    });

    res.json(saved); // or just res.json({ reply: aiReply });
  } catch (error) {
    if (error.response) {
      // Handle specific HTTP errors
      if (error.response.status === 404) {
        console.error("AI service endpoint not found:", error.response.data);
        return res.status(404).json({ error: "AI service endpoint not found" });
      }
      try {
        console.error("AI service error:", JSON.stringify(error.response.data, null, 2));
      } catch (e) {
        console.error("AI service error (stringify failed):", error.message);
      }
    } else if (error.request) {
      console.error("No response from AI service:", error.request);
      return res.status(500).json({ error: "No response from AI service" });
    } else {
      console.error("Error in AI service request:", error.message);
      return res.status(500).json({ error: "AI service failed" });
    }
  }
};

module.exports = { askAI };
