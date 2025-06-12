import axios from "axios";
import * as types from "./actionType";

const END_POINT = "https://backend-collabify-production.up.railway.app";

const jwtToken = () => {
  const userData = JSON.parse(localStorage.getItem("chat-app-login-user-data"));
  return "Bearer " + String(userData.token);
};

// search users
const searchUsers = (query) => async (dispatch) => {
  if (query.length === 0) {
    return false;
  }

  dispatch({ type: types.SEARCH_USER_PROCESSING });
  try {
    const result = await axios.get(`${END_POINT}/api/user?search=${query}`, {
      headers: {
        Authorization: jwtToken(),
      },
    });
    dispatch({ type: types.SEARCH_USER_SUCCESS, payload: result.data });
  } catch (error) {
    dispatch({ type: types.SEARCH_USER_FAIL });
  }
};

// creating one to one chat
const createSingleUserChat = (userId) => async (dispatch) => {
  dispatch({ type: types.SINGLE_CHAT_CREATE_PROCESSING });
  try {
    const result = await axios.post(
      `${END_POINT}/api/chat`,
      { userId: userId },
      {
        headers: {
          Authorization: jwtToken(),
        },
      }
    );

    localStorage.setItem("chat-app-single-user-chat", JSON.stringify(result.data));
    dispatch({ type: types.SINGLE_CHAT_CREATE_SUCCESS, payload: result.data });
  } catch (error) {
    dispatch({ type: types.SINGLE_CHAT_CREATE_FAIL });
  }
};

//  get all chat
const getChats = () => async (dispatch) => {
  dispatch({ type: types.ALL_CHATS_REQUEST_PROCESSING });
  try {
    const result = await axios.get(`${END_POINT}/api/chat`, {
      headers: {
        Authorization: jwtToken(),
      },
    });
    dispatch({ type: types.ALL_CHATS_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    dispatch({ type: types.ALL_CHATS_REQUEST_FAIL, payload: error.response.data.error });
  }
};

// creating group
const createGroup = (obj) => async (dispatch) => {
  dispatch({ type: types.CREATE_GROUP_REQUEST_PROCESSING });
  try {
    const result = await axios.post(`${END_POINT}/api/chat/group`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.CREATE_GROUP_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.CREATE_GROUP_REQUEST_FAIL });
  }
};

// select user for chat
const selectUserForChat = (obj) => async (dispatch) => {
  dispatch({ type: types.SELECT_USER_FOR_CHAT, payload: obj });
};

// rename group
const changeGroupName = (obj) => async (dispatch) => {
  dispatch({ type: types.RENAME_GROUP_REQUEST_PROCESSING });
  try {
    const result = await axios.put(`${END_POINT}/api/chat/rename`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.RENAME_GROUP_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.RENAME_GROUP_REQUEST_FAIL });
  }
};

// send message
const sendMessage = (obj) => async (dispatch) => {
  dispatch({ type: types.SEND_MESSAGE_REQUEST_PROCESSING });
  try {
    const result = await axios.post(`${END_POINT}/api/message`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.SEND_MESSAGE_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.SEND_MESSAGE_REQUEST_FAIL });
  }
};

// get message
const getMessage = (id) => async (dispatch) => {
  dispatch({ type: types.GET_MESSAGE_REQUEST_PROCESSING });
  try {
    const result = await axios.get(`${END_POINT}/api/message/${id}`, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.GET_MESSAGE_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.GET_MESSAGE_REQUEST_FAIL });
  }
};

// set web socket recieved message to messages
const setWebSocketReceivedMessage = (allMessages, receivedMessage, notificationsMessages, selectedUserForChat) => async (dispatch) => {
  if (!selectedUserForChat) {
    if (notificationsMessages && notificationsMessages.length >= 1) {
      const isAlreadyReceivedNotification = notificationsMessages.some((message) => message._id === receivedMessage.chat._id);
      if (!isAlreadyReceivedNotification) {
        dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
      }
    } else {
      dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
    }
    return;
  }

  if (Array.isArray(allMessages) && allMessages.length > 0) {
    const isSameChat = allMessages.some((message) => message.chat._id === receivedMessage.chat._id);
    const isAlreadyReceived = allMessages.some((message) => message._id === receivedMessage._id);

    if (isSameChat && !isAlreadyReceived) {
      dispatch({ type: types.WEB_SOCKET_RECEIVED_MESSAGE, payload: receivedMessage });
    } else if (!isSameChat && !isAlreadyReceived) {
      if (notificationsMessages && notificationsMessages.length >= 1) {
        const isAlreadyReceivedNotification = notificationsMessages.some((message) => message._id === receivedMessage.chat._id);
        if (!isAlreadyReceivedNotification) {
          dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
        }
      } else {
        dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
      }
    }
  } else {
    if (selectedUserForChat._id === receivedMessage.chat._id) {
      dispatch({ type: types.WEB_SOCKET_RECEIVED_MESSAGE, payload: receivedMessage });
    } else {
      if (notificationsMessages && notificationsMessages.length >= 1) {
        const isAlreadyReceivedNotification = notificationsMessages.some((message) => message._id === receivedMessage.chat._id);
        if (!isAlreadyReceivedNotification) {
          dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
        }
      } else {
        dispatch({ type: types.WEB_SOCKET_NOTIFICATION_RECEIVED, payload: receivedMessage });
      }
    }
  }
};

// add members in group
const addMembersInGroup = (obj) => async (dispatch) => {
  dispatch({ type: types.ADD_NEW_MEMBER_GROUP_REQUEST_PROCESSING });
  try {
    const result = await axios.put(`${END_POINT}/api/chat/group/user/add`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.ADD_NEW_MEMBER_GROUP_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.ADD_NEW_MEMBER_GROUP_REQUEST_FAIL });
  }
};

// remove members from group
const removeMembersFromGroup = (obj) => async (dispatch) => {
  dispatch({ type: types.REMOVE_MEMBER_FROM_GROUP_REQUEST_PROCESSING });
  try {
    const result = await axios.put(`${END_POINT}/api/chat/group/user/remove`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.REMOVE_MEMBER_FROM_GROUPP_REQUEST_SUCCESS, payload: result.data });
  } catch (error) {
    console.log(error);

    dispatch({ type: types.REMOVE_MEMBER_FROM_GROUP_REQUEST_FAIL });
  }
};

const getAIResponse = (userInput, chatId) => async (dispatch) =>{
  dispatch({type: types.AI_REQUEST_PROCESSING});
  try{
    let prompt = "";
    if (userInput.includes("error") || userInput.toLowerCase().includes("exception")) {
      prompt = `Jelaskan error berikut secara jelas dan berikan solusi jika ada:\n---\n${userInput}\n---\nJika memungkinkan, berikan contoh perbaikan kode.`;
    } else if (
      userInput.includes("function") || userInput.includes(";") || userInput.includes("{")
    ) {
      prompt = `Berdasarkan potongan kode berikut, carikan referensi repository GitHub open-source yang relevan, dan berikan sedikit penjelasan:\n---\n${userInput}\n---\nFormat balasan:\n- Penjelasan singkat\n- Daftar repository dengan nama & link`;
    } else {
      prompt = `Pertanyaan tidak relevan dengan error programming: ${userInput}`;
    }

    const userData = JSON.parse(localStorage.getItem("chat-app-login-user-data"));
    const user_id = userData?._id;
    const {data} = await axios.post(`${END_POINT}/api/ai/ask`, {
      prompt:prompt,
      chatId,
      user_id,
    });

    dispatch({type:types.AI_REQUEST_SUCCESS});
    dispatch(getMessage(chatId));
    
  }catch(error){
    console.log(error);
    dispatch({type: types.AI_REQUEST_FAIL});
  }
};

const joinGroup = (chatId) => async (dispatch) => {
  dispatch({ type: types.JOIN_GROUP_REQUEST });

  try{
    const result = await axios.put(`${END_POINT}/api/chat/group/user/join`, { chatId }, {
      headers: {
        Authorization: jwtToken(),
      },
    });
    dispatch({
      type: types.JOIN_GROUP_REQUEST_SUCCESS,
      payload: result.data, // berisi full chat object
    });
  }catch(error){
    dispatch({
      type: types.JOIN_GROUP_REQUEST_FAIL,
      payload: error.response?.data?.error || "Failed to join group chat",
    })
  }
};

// exit group
const exitGroup = (obj) => async (dispatch) => {
  dispatch({ type: types.EXIT_GROUP_REQUEST });

  try {
    const result = await axios.put(`${END_POINT}/api/chat/group/user/exit`, obj, {
      headers: {
        Authorization: jwtToken(),
      },
    });

    dispatch({ type: types.EXIT_GROUP_SUCCESS, payload: result.data });

    // opsional: hapus chat dari local state jika perlu
    dispatch({ type: types.DELETE_CHAT_FROM_USER_VIEW, payload: obj.chatId });
  } catch (error) {
    console.log("Exit group error:", error);
    dispatch({ type: types.EXIT_GROUP_FAIL });
  }
};

export const resetSelectedUserForChat = () => ({
  type: "RESET_SELECTED_USER_FOR_CHAT",
});

export { searchUsers, createSingleUserChat, getChats, createGroup, addMembersInGroup, removeMembersFromGroup, changeGroupName, selectUserForChat, sendMessage, getMessage, setWebSocketReceivedMessage, getAIResponse, joinGroup, exitGroup };
