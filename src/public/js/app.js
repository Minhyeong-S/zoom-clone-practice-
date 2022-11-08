// frontend
// socket: app.js(frontend)에서의 socket => 서버로의 연결!
const socket = new WebSocket(`ws://${window.location.host}`);

// open 이벤트 추가 : connection 이 open 되었을 때 발동 (서버와 연결되었을 때)
socket.addEventListener('open', () => {
  console.log('connected to Server ✅');
});

// message 이벤트 추가 : message를 받을 때마다 발동
socket.addEventListener('message', (message) => {
  console.log('just got this: ', message.data, 'from the Server');
});

// close 이벤트 추가 : 서버가 오프라인이 될 때 발동
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌');
});
