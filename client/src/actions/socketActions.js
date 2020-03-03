import { socketConstants } from "../_constants/socketConstants";
import { userConstants } from "../_constants/userConstants";
import { chatConstants } from "../_constants/chatConstants";
import { socketService } from "../_services/socketService";
import { notificationActions } from "../actions/notificationActions";
import { chatActions } from "../actions/chatActions";

export const socketActions = {
  connect
};

function connect() {
  return dispatch => {
    socketService.connect().then(socket => {
      dispatch(connectSocket(socket));
      socket.on("newNotification", data => {
        dispatch(notificationActions.addNotification(data));
      });

      socket.on("newMessage", data => {
        dispatch(chatActions.newMessage(data));
      });

      socket.on("readMessages", data => {
        dispatch({ type: chatConstants.RECEIVE_READ_MESSAGES, data });
      });

      socket.on("newUser", data => {
        dispatch({ type: userConstants.NEW_USER, user: data });
      });

      socket.on("imageMessageRequest", data => {
        function request(message) {
          return { type: chatConstants.SEND_MESSAGE_REQUEST, message };
        }
        dispatch(request({ ...data, sent: false }));
      });

      socket.on("imageMessage", data => {
        function success(message) {
          return { type: chatConstants.SEND_MESSAGE_SUCCESS, message };
        }
        dispatch({ type: chatConstants.INC_MESSAGE_COUNT });
        dispatch(success({ ...data }));
      });

      socket.on("newRoom", data => {
        dispatch({ type: chatConstants.INIT_MESSAGE_ARRAY, roomId: data._id });
        dispatch({ type: chatConstants.ADD_NEW_ROOM, room: data });
      });

      socket.on("typing", data => {
        dispatch(chatActions.typing(data.roomId));
      });

      socket.on("stoppedTyping", data => {
        dispatch(chatActions.stoppedTyping(data.roomId));
      });

      socket.on("activityStatusUpdate", data => {
        dispatch(chatActions.changeActivityStatus(data));
      });
      socket.on("newCall", data => {
        dispatch({ type: chatConstants.OPEN_ANSWERING_MODAL, data });
      });
    });
  };
  function connectSocket(socket) {
    return { type: socketConstants.CONNECT, socket };
  }
}
