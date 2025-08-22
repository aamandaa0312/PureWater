require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const IA = require('./IA');

const app = express();

// Configurações importantes
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota da API do chatbot
app.post('/api/chat', async (req, res) => {
  try {
    console.log("Recebida mensagem:", req.body.message);
    const response = await IA.executar(req.body.message);
    res.json({ response });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ 
      error: "Erro interno",
      details: error.message 
    });
  }
});

// Todas outras rotas servem o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});