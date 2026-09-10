// Almacenar mensajes en localStorage
const STORAGE_KEY = 'foro_mensajes';

// Elementos del DOM
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');
const countSpan = document.getElementById('count');

// Cargar mensajes al iniciar
let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
renderMessages();
updateCount();

// Enviar mensaje
sendBtn.addEventListener('click', addMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addMessage();
    }
});

function addMessage() {
    const username = usernameInput.value.trim() || 'Anónimo';
    const text = messageInput.value.trim();

    if (!text) {
        alert('Por favor escribe un mensaje');
        return;
    }

    const message = {
        id: Date.now(),
        username: username,
        text: text,
        timestamp: new Date().toLocaleString('es-ES'),
        edited: false
    };

    messages.push(message);
    saveMessages();
    renderMessages();
    updateCount();

    // Limpiar inputs
    messageInput.value = '';
    messageInput.focus();

    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderMessages() {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'message';
        msgElement.innerHTML = `
            <div class="message-header">
                <span class="message-user">👤 ${escapeHtml(msg.username)}</span>
                <span class="message-time">${msg.timestamp} ${msg.edited ? '✏️ editado' : ''}</span>
            </div>
            <div class="message-text">${escapeHtml(msg.text)}</div>
            <div class="message-actions">
                <button class="btn-edit" onclick="editMessage(${msg.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteMessage(${msg.id})">🗑️ Eliminar</button>
            </div>
        `;
        messagesContainer.appendChild(msgElement);
    });
}

function editMessage(id) {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    const newText = prompt('Editar mensaje:', message.text);
    if (newText && newText.trim()) {
        message.text = newText.trim();
        message.edited = true;
        saveMessages();
        renderMessages();
    }
}

function deleteMessage(id) {
    if (confirm('¿Eliminar este mensaje?')) {
        messages = messages.filter(m => m.id !== id);
        saveMessages();
        renderMessages();
        updateCount();
    }
}

function saveMessages() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function updateCount() {
    countSpan.textContent = messages.length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
