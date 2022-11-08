// Frontend
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
// socket: app.js(frontend)에서의 socket => 서버로의 연결!
const socket = new WebSocket(`ws://${window.location.host}`); // 1

// open 이벤트 추가 : connection 이 open 되었을 때 발동 (서버와 연결되었을 때)
socket.addEventListener('open', () => {
  console.log('connected to Server ✅'); // 3
});

// message 이벤트 추가 : message를 받을 때마다 발동
socket.addEventListener('message', (message) => {
  // 5
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

// close 이벤트 추가 : 서버가 오프라인이 될 때 발동
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌');
});

// 브라우저에서 서버로 메세지 보내기
// setTimeout(() => {
//   // 6
//   socket.send('hello from the browser!');
// }, 5000);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  // json 형식으로 데이터 만든 후 JSON.stringify 로 변환해서 보내기
  socket.send(makeMessage('new_message', input.value));
  const li = document.createElement('li');
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
}

messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
