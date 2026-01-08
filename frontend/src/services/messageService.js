// messageService.js
import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000/api/messages/';

export async function fetchMessages() {
  // ... coloque a lógica do GET aqui
  const response = await axios.get(BACKEND_URL);
  return response.data;
}

export async function createMessage(data) {
  // ... coloque a lógica do POST aqui
  const response = await axios.post(BACKEND_URL, data);
  return response.data;
}
// exporte todas as suas funções de API daqui