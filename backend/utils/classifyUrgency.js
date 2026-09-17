const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const classifyUrgency = async (foodType, expiryTime) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const hoursLeft = Math.round((new Date(expiryTime) - new Date()) / (1000 * 60 * 60));

    const prompt = `You are FoodBridge's urgency classifier for food donations.

Food type: "${foodType}"
Hours remaining before expiry: ${hoursLeft}

Classify this donation's urgency as exactly one of: "Urgent", "Moderate", "Low".
Rules: Perishable/cooked food with less than 6 hours left = Urgent.
Perishable food with 6-24 hours left = Moderate.
Non-perishable food (grains, packaged, canned) or more than 24 hours left = Low.

Respond ONLY in this exact JSON format, nothing else, no markdown:
{"urgency": "<Urgent|Moderate|Low>", "reason": "<one short sentence why>"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (err) {
    console.error("Urgency classification failed:", err.message);
    return { urgency: "Moderate", reason: "Could not classify automatically." };
  }
};

module.exports = classifyUrgency;