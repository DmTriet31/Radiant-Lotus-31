const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function handleSmartAI(message) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Bạn là một chatbot vui vẻ, thông minh, hỗ trợ người dùng." },
        { role: "user", content: message }
      ],
    });

    return completion.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI error:", err);
    return "Bot đang gặp lỗi khi gọi OpenAI 😥";
  }
}

module.exports = { handleSmartAI };
