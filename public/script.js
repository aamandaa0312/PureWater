document.addEventListener('DOMContentLoaded', function() {
    // ========== MAPA ========== //
    const map = L.map('map').setView([-23.5505, -46.6333], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  
    const pontosColeta = [
      {
        nome: "PurePoint Centro",
        coordenadas: [-23.5505, -46.6333],
        endereco: "Rua Principal, 123"
      },
      {
        nome: "Recicla Zona Sul",
        coordenadas: [-23.5605, -46.6433],
        endereco: "Av. Sustentável, 456"
      }
    ];
  
    pontosColeta.forEach(ponto => {
      const marker = L.marker(ponto.coordenadas, { icon: greenIcon }).addTo(map);
      marker.bindPopup(`
        <h5>${ponto.nome}</h5>
        <p>${ponto.endereco}</p>
        <button class="btn btn-sm btn-primary btn-chatbot" 
                data-local="${ponto.nome}">
          Perguntar sobre este local
        </button>
      `);
    });
  
    // ========== CHATBOT ========== //
    const chatButton = document.getElementById('chatbot-button');
    const chatWindow = document.getElementById('chat-window');
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
  
    // Funções auxiliares
    function addMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${sender}`;
      messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-indicator';
      typingDiv.className = 'chat-message bot';
      typingDiv.innerHTML = `
        <div class="message-bubble typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      `;
      chatLog.appendChild(typingDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  
    function hideTypingIndicator() {
      const typingDiv = document.getElementById('typing-indicator');
      if (typingDiv) typingDiv.remove();
    }
  
    // Event Listeners
    chatButton.addEventListener('click', () => {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
      if (chatWindow.style.display === 'flex') {
        userInput.focus();
      }
    });
  
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      
      addMessage('user', message);
      userInput.value = '';
      showTypingIndicator();
      
      try {
        const response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        addMessage('bot', data.response);
      } catch (error) {
        console.error("Erro na requisição:", error);
        addMessage('bot', "Erro ao conectar com o servidor. Verifique se o servidor está rodando.");
      } finally {
        hideTypingIndicator();
      }
    }
  
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  
    // Delegation para botões dinâmicos
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-chatbot')) {
        const local = e.target.getAttribute('data-local');
        userInput.value = `Conte mais sobre ${local}`;
        chatWindow.style.display = 'flex';
        userInput.focus();
      }
    });
  });
  