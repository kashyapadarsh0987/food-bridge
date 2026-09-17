const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const estimateMeals = async (foodType, quantity) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `A food donation contains "${quantity}" of "${foodType}".
Respond ONLY in this exact JSON format, nothing else, no markdown:
{"estimatedMeals": <number>, "safetyTip": "<one short sentence>"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (err) {
    console.error("AI estimate failed:", err.message);
    return { estimatedMeals: null, safetyTip: "Could not generate tip right now." };
  }
};

module.exports = estimateMeals;