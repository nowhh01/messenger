import io from 'socket.io-client';
import store from './store';
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  replaceMessagesAndCount,
} from './store/conversations';

const socket = io(window.location.origin, { autoConnect: false });

socket.on('connect', () => {
  console.log('connected to server');

  socket.on('add-online-user', (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on('remove-offline-user', (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on('new-message', (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on('updated-messages', (messages) => {
    store.dispatch(replaceMessagesAndCount(messages));
  });
});

export default socket;
