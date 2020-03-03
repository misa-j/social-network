import { chatConstants } from "../_constants/chatConstants";
import { chatService } from "../_services/chatService";

export const chatActions = {
  typing,
  stoppedTyping,
  changeRoom,
  getChatRooms,
  getMessagesForRoom,
  sendMessage,
  sendImage,
  newMessage,
  readMessages,
  changeActivityStatus,
  imageMessageRequest,
  call,
  answer,
  endCall,
  endAnsweringCall,
  searchUsers
};

function typing(roomId) {
  return dispatch => {
    dispatch({ type: chatConstants.TYPING, roomId });
  };
}

function stoppedTyping(roomId) {
  return dispatch => {
    dispatch({ type: chatConstants.STOPPED_TYPING, roomId });
  };
}

function initiateMessageArray(roomId) {
  return { type: chatConstants.INIT_MESSAGE_ARRAY, roomId };
}

function changeRoom(room) {
  return dispatch => {
    dispatch({ type: chatConstants.CHANGE_ROOM, room });
  };
}

function readMessages(params) {
  const { messageIds, roomId } = params;
  return dispatch => {
    dispatch(read(messageIds, roomId));
    chatService.readMessages(params).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };
  function read(messageIds, roomId) {
    return { type: chatConstants.READ_MESSAGES, messageIds, roomId };
  }
}

function getChatRooms() {
  return dispatch => {
    dispatch(request());

    chatService.getChatRooms().then(
      response => {
        dispatch(success(response.rooms));

        response.rooms.forEach(room =>
          dispatch(initiateMessageArray(room._id))
        );
      },
      error => {
        console.log(error);
      }
    );
  };
  function request() {
    return { type: chatConstants.GET_ROOMS_REQUEST };
  }
  function success(rooms) {
    return { type: chatConstants.GET_ROOMS_SUCCESS, rooms };
  }
}

function changeActivityStatus(user) {
  return dispatch => {
    dispatch({ type: chatConstants.CHANGE_ACTIVITY_STATUS, user });
  };
}

function getMessagesForRoom(room) {
  return dispatch => {
    if (room.initialFetch) {
      dispatch(initialRequest(room._id));
    } else {
      dispatch(request(room._id));
    }
    chatService.getMessagesForRoom(room).then(
      response => {
        dispatch(
          success({ messages: response.messages.reverse(), roomId: room._id })
        );
      },
      error => {
        console.log(error);
      }
    );
  };
  function request(roomId) {
    return { type: chatConstants.GET_MESSAGES_REQUEST, roomId };
  }
  function initialRequest(roomId) {
    return { type: chatConstants.GET_MESSAGES_INITIAL_REQUEST, roomId };
  }
  function success(data) {
    return { type: chatConstants.GET_MESSAGES_SUCCESS, data };
  }
}

function sendMessage(message) {
  return dispatch => {
    dispatch(request({ ...message, sent: false }));

    chatService.sendMessage(message).then(
      response => {
        dispatch(success(response.message));
      },
      error => {
        console.log(error);
      }
    );
  };
  function request(message) {
    return { type: chatConstants.SEND_MESSAGE_REQUEST, message };
  }
  function success(message) {
    return { type: chatConstants.SEND_MESSAGE_SUCCESS, message };
  }
}

function sendImage(data, message) {
  return dispatch => {
    dispatch(request({ ...message, sent: false }));

    chatService.sendImage(data).then(
      response => {
        dispatch(success(response.message));
      },
      error => {
        console.log(error);
      }
    );
  };
  function request(message) {
    return { type: chatConstants.SEND_MESSAGE_REQUEST, message };
  }
  function success(message) {
    return { type: chatConstants.SEND_MESSAGE_SUCCESS, message };
  }
}

function newMessage(message) {
  return dispatch => {
    dispatch(success(message));
    dispatch({ type: chatConstants.INC_MESSAGE_COUNT });
  };
  function success(message) {
    return { type: chatConstants.NEW_MESSAGE, message };
  }
}

function imageMessageRequest(message) {
  return dispatch => {
    dispatch(success(message));
  };
  function success(message) {
    return { type: chatConstants.NEW_IMAGE_MESSAGE_REQUEST, message };
  }
}

function call(data) {
  return dispatch => {
    dispatch({ type: chatConstants.OPEN_CALLING_MODAL });

    chatService.call(data).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };
}

function answer(data) {
  return dispatch => {
    chatService.answer(data).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };
}

function endCall() {
  return dispatch => {
    dispatch({ type: chatConstants.CLOSE_CALLING_MODAL });
  };
}

function endAnsweringCall() {
  return dispatch => {
    dispatch({ type: chatConstants.CLOSE_ANSWERING_MODAL });
  };
}

function searchUsers(rooms) {
  return dispatch => {
    dispatch({ type: chatConstants.SEARCH_USERS, rooms });
  };
}
