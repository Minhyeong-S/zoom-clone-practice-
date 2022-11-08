// Backend
import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import e from 'express';
import { parse } from 'path';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/*
socket: server.js에서의 socket은 연결된 브라우저!! 
      : 어딘가에 저장해야 한다. 최소한 console.log라도..
      : 서버와 브라우저 사이의 연결
function handleConnection(socket) {
  console.log(socket);
}

on : 이벤트 발동을(이벤트 예: connection) 기다리는 Method
   : backend에 연결된 사람의 정보를 제공한다. socket에 담겨 있음.
handleConnection : 이벤트가 발동했을 때 작동하는 함수
wss.on('connection', handleConnection);
*/

// 누가 접속한 건지 저장해 두었다가 모두에게 다시 메세지 전달하기 위함
const sockets = [];

// socket을 사용한다는 것을 좀 더 직관적으로 알아볼 수 있도록 익명함수 사용
wss.on('connection', (socket) => {
  // 접속한 소켓 sockets 배열에 추가하기
  sockets.push(socket);
  socket['nickname'] = 'Anon';
  console.log('connected to Browser ✅'); // 2
  console.log(sockets.length);

  // 브라우저에서 보낸 메세지 받기 (그대로 받을 경우 디코딩 필요)
  socket.on('message', (msg, isBinary) => {
    // 7
    const decodedMessage = isBinary ? msg : msg.toString();
    const parsedMessage = JSON.parse(decodedMessage);
    switch (parsedMessage.type) {
      case 'new_message':
        sockets.forEach((aSocket) => {
          return aSocket.send(`${socket.nickname}: ${parsedMessage.payload}`);
        });
      case 'nickname':
        console.log(parsedMessage.payload);
        socket['nickname'] = parsedMessage.payload;
    }
  });

  // 브라우저에서 연결이 끊어졌을 때 close 이벤트 발동
  socket.on('close', (socket) => {
    const index = sockets.indexOf(socket);
    console.log('Disconnected from the Browser ❌');
    sockets.splice(index, 1);
    console.log(sockets.length);
  });
});

server.listen(3000, handleListen);

// 메세지 보내기 : socket.send()  : socekt 에 있는 method
// sockets.forEach((aSocket) => aSocket.send(parsedMessage.payload));
