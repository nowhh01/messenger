import axios from 'axios';
import socket from '../../socket';
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  replaceMessagesAndCount,
} from '../conversations';
import { gotUser, setFetchingStatus } from '../user';

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem('messenger-token');
  config.headers['x-access-token'] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get('/auth/user');
    dispatch(gotUser(data));

    if (data.id) {
      connectSocketIo();
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post('/auth/register', credentials);
    await localStorage.setItem('messenger-token', data.token);

    dispatch(gotUser(data));
    connectSocketIo();
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    await localStorage.setItem('messenger-token', data.token);

    dispatch(gotUser(data));
    connectSocketIo();
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || 'Server Error' }));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.delete('/auth/logout');
    await localStorage.removeItem('messenger-token');

    dispatch(gotUser({}));
    socket.disconnect();
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/conversations');
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post('/api/messages', body);
  return data;
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }
  } catch (error) {
    console.error(error);
  }
};

export const findAndUpdateUnreadToReadMessages =
  (conversationId) => async (dispatch) => {
    try {
      const { data } = await axios.put(
        '/api/messages/unread-to-read-from-other',
        {
          conversationId,
        },
      );
      const messages = data.messages;

      if (messages?.length > 0) {
        socket.emit('updated-messages', messages);

        dispatch(replaceMessagesAndCount(messages, 0));
      }
    } catch (error) {
      console.error(error);
    }
  };

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

const connectSocketIo = async () => {
  const token = await localStorage.getItem('messenger-token');

  socket.auth = { token };
  socket.connect();
};
