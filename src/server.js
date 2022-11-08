import http from 'http';
import WebSocket from 'ws';
import express from 'express';

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

// socket을 사용한다는 것을 좀 더 직관적으로 알아볼 수 있도록 익명함수 사용
wss.on('connection', (socket) => {
  console.log('connected to Browser ✅');
  socket.on('close', () => {
    console.log('Disconnected from the Browser ❌');
  });

  // 메세지 보내기 : socket에 있는 method
  // connection 이 생겼을 때 socket으로 즉시 메세지를 보낸 것!
  socket.send('hello!!!');
});

server.listen(3000, handleListen);
