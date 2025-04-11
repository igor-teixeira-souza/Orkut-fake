const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Rota para a página inicial
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

// Evento para quando o cliente se conecta ao servidor via Socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Evento para quando o cliente envia uma mensagem via Socket.io
  socket.on('chat message', (data) => {
    // Adiciona timestamp se não existir
    if (!data.time) {
      const now = new Date();
      data.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    // Envia a mensagem para todos os clientes, EXCETO para o remetente original
    socket.broadcast.emit('chat message', data);
  });

  socket.on('disconnect', () => console.log('Usuário desconectado'));
});

// Inicia o servidor na porta 3000
http.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000 - Link http://localhost:3000`);
});