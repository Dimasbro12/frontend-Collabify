const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const AIMessage = require("../models/aiMessage.model");
dotenv.config();

// Inisialisasi SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Konfigurasi model dan pengaturan
const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// In-memory session cache
const userSessions = {};

const askAI = async (req, res) => {
  const { prompt, user_id } = req.body;

  if (!prompt || !user_id) {
    return res.status(400).json({ error: "Prompt and userId are required" });
  }

  try {
    // Gunakan model Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig,
      safetySettings,
      
    });

    // Buat session baru kalau user belum punya
    if (!userSessions[user_id]) {
      userSessions[user_id] = await model.startChat({ history: [] });
    }

    const session = userSessions[user_id];

    // Kirim prompt ke AI
    const result = await session.sendMessage(prompt);
    const aiReply = result.response.text();

    // Simpan ke database (jika diperlukan)
    const saved = await AIMessage.create({
      user: user_id,
      prompt,
      reply: aiReply,
    });

    return res.json(saved); // atau bisa: res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI error:", error.message || error);
    return res.status(500).json({ error: "Something went wrong with AI service" });
  }
};

module.exports = { askAI };


// const axios = require("axios");
// const AIMessage = require("../models/aiMessage.model");

// const askAI = async (req, res) => {
//   const { prompt, user_id } = req.body;

//   if (!prompt || !user_id) {
//     console.log("Body received:", req.body);
//     console.log("Prompt:", prompt);
//     console.log("User ID:", user_id);

//     return res.status(400).json({ error: "Prompt and userId are required" });
    
//   }

//   try {
//     // Example API call to AI (change to your real endpoint)
//     const response = await axios.post("http://localhost:8080/api/ai/ask", { 
//       prompt,
//       user_id
//      });
//     const aiReply = response.data.reply;

//     // Save to DB
//     const saved = await AIMessage.create({
//       user: user_id,
//       prompt,
//       reply: aiReply,
//     });

//     res.json({ reply: aiReply });
//   } catch (error) {
//     if (error.response) {
//       // Handle specific HTTP errors
//       if (error.response.status === 404) {
//         console.error("AI service endpoint not found:", error.response.data);
//         return res.status(404).json({ error: "AI service endpoint not found" });
//       }
//       try {
//         console.error("AI service error:", JSON.stringify(error.response.data, null, 2));
//       } catch (e) {
//         console.error("AI service error (stringify failed):", error.message);
//       }
//     } else if (error.request) {
//       console.error("No response from AI service:", error.request);
//       return res.status(500).json({ error: "No response from AI service" });
//     } else {
//       console.error("Error in AI service request:", error.message);
//       return res.status(500).json({ error: "AI service failed" });
//     }
//   }
// };

// module.exports = { askAI };