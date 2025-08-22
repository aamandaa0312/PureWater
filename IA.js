require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.7
    }
  });
  

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Você é um assistente especializado em sustentabilidade urbana chamado PureBot. Responda de forma clara e concisa (máx 200 palavras) sobre reciclagem, energia renovável e mobilidade sustentável." }],
    },
    {
      role: "model",
      parts: [{ text: "Entendido! Sou o PureBot, especialista em sustentabilidade urbana. Posso ajudar com: ♻️ Reciclagem, ☀️ Energia renovável e 🚲 Mobilidade sustentável. Como posso ajudar hoje?" }]
    }
  ],
  generationConfig: {
    maxOutputTokens: 200,
    temperature: 0.7
  }
});

const IA = {
  executar: async function(prompt) {
    if(!prompt) return "Por favor, digite sua mensagem.";
    
    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro no Gemini:", error);

      if(error.status === 429) {
        return "Estou recebendo muitas requisições agora. Por favor, tente novamente em 1 minuto.";
      }
      return "Desculpe, estou com problemas técnicos. Tente novamente mais tarde.";
    }
  }
}

module.exports = IA;