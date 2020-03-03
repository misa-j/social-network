import { chatConstants } from "../_constants/chatConstants";

export function chat(
  state = {
    rooms: [],
    currentRoom: null,
    roomsFetching: false,
    roomId: null,
    callingModal: false,
    answeringModal: {
      isOpen: false
    },
    searchedRooms: null
  },
  action
) {
  switch (action.type) {
    case chatConstants.TYPING:
      if (state[action.roomId]) {
        return {
          ...state,
          [action.roomId]: {
            ...state[action.roomId],
            isTyping: true
          }
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.STOPPED_TYPING:
      if (state[action.roomId]) {
        return {
          ...state,
          [action.roomId]: {
            ...state[action.roomId],
            isTyping: false
          }
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.CHANGE_ROOM:
      return {
        ...state,
        currentRoom: action.room,
        roomId: action.room._id
      };
    case chatConstants.INIT_MESSAGE_ARRAY:
      if (!state[action.roomId]) {
        return {
          ...state,
          [action.roomId]: {
            messages: [],
            initialMessagesFetchig: false,
            messageFetching: false,
            isTyping: false
          }
        };
      } else {
        return {
          ...state
        };
      }

    case chatConstants.GET_ROOMS_REQUEST:
      return {
        ...state,
        roomsFetching: true
      };
    case chatConstants.GET_ROOMS_SUCCESS:
      return {
        ...state,
        rooms: action.rooms,
        roomsFetching: false
      };
    case chatConstants.ADD_NEW_ROOM:
      return {
        ...state,
        rooms: [action.room, ...state.rooms]
      };
    case chatConstants.GET_MESSAGES_INITIAL_REQUEST:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          initialMessagesFetchig: true
        }
      };
    case chatConstants.GET_MESSAGES_REQUEST:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          messageFetching: true
        }
      };
    case chatConstants.GET_MESSAGES_SUCCESS:
      return {
        ...state,
        [action.data.roomId]: {
          ...state[action.data.roomId],
          messages: [
            ...action.data.messages,
            ...state[action.data.roomId].messages
          ],
          messageFetching: false,
          initialMessagesFetchig: false
        }
      };
    case chatConstants.SEND_MESSAGE_REQUEST:
      let currentRoom = state.currentRoom;
      if (currentRoom && state.currentRoom._id === action.message.roomId) {
        currentRoom = {
          ...state.currentRoom,
          messages: state.currentRoom.messages + 1
        };
      }
      if (state[action.message.roomId]) {
        return {
          ...state,
          [action.message.roomId]: {
            ...state[action.message.roomId],
            messages: [...state[action.message.roomId].messages, action.message]
          },
          rooms: state.rooms.map(room => {
            if (room._id === action.message.roomId) {
              return {
                ...room,
                messages: room.messages + 1
              };
            } else {
              return room;
            }
          }),
          currentRoom
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.SEND_MESSAGE_SUCCESS:
      if (state[action.message.roomId]) {
        const index = state.rooms.findIndex(
          room => room._id === action.message.roomId
        );
        const newRoom = state.rooms[index];

        return {
          ...state,
          [action.message.roomId]: {
            ...state[action.message.roomId],
            messages: state[action.message.roomId].messages.map(message => {
              if (message.uuid === action.message.uuid) {
                return action.message;
              } else {
                return message;
              }
            })
          },
          rooms: [
            {
              ...newRoom,
              //messages: newRoom.messages + 1,
              lastMessage: [action.message]
            },
            ...state.rooms.filter(room => room._id !== action.message.roomId)
          ]
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.NEW_MESSAGE:
      if (state[action.message.roomId]) {
        const index = state.rooms.findIndex(
          room => room._id === action.message.roomId
        );
        const newRoom = state.rooms[index];

        let currentRoom = state.currentRoom;
        if (currentRoom && state.currentRoom._id === action.message.roomId) {
          currentRoom = {
            ...state.currentRoom,
            messages: state.currentRoom.messages + 1
          };
        }
        return {
          ...state,
          [action.message.roomId]: {
            ...state[action.message.roomId],
            messages: [...state[action.message.roomId].messages, action.message]
          },
          currentRoom,
          rooms: [
            {
              ...newRoom,
              messages: newRoom.messages + 1,
              lastMessage: [action.message]
            },
            ...state.rooms.filter(room => room._id !== action.message.roomId)
          ]
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.READ_MESSAGES:
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          messages: state[action.roomId].messages.map(message => {
            if (action.messageIds.includes(message._id)) {
              return {
                ...message,
                read: true
              };
            } else {
              return {
                ...message
              };
            }
          })
        }
      };
    case chatConstants.CHANGE_ACTIVITY_STATUS:
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.members[0]._id === action.user.user) {
            room.members[0].activityStatus = action.user.activityStatus;
            return {
              ...room
            };
          } else if (room.members[1]._id === action.user.user) {
            room.members[1].activityStatus = action.user.activityStatus;
            return {
              ...room
            };
          } else {
            return {
              ...room
            };
          }
        })
      };
    case chatConstants.RECEIVE_READ_MESSAGES:
      if (state[action.data.roomId]) {
        return {
          ...state,
          [action.data.roomId]: {
            ...state[action.data.roomId],
            messages: state[action.data.roomId].messages.map(message => {
              if (action.data.messageIds.includes(message._id)) {
                return {
                  ...message,
                  read: true
                };
              } else {
                return {
                  ...message
                };
              }
            })
          }
        };
      } else {
        return {
          ...state
        };
      }
    case chatConstants.OPEN_CALLING_MODAL:
      return {
        ...state,
        callingModal: true
      };
    case chatConstants.CLOSE_CALLING_MODAL:
      return {
        ...state,
        callingModal: false
      };
    case chatConstants.OPEN_ANSWERING_MODAL:
      return {
        ...state,
        answeringModal: {
          ...state.answeringModal,
          isOpen: true,
          webRtc: {
            ...state.webRtc,
            ...action.data.webRtc
          },
          caller: {
            ...state.caller,
            ...action.data.caller
          },
          room: {
            ...state.room,
            ...action.data.room
          }
        }
      };
    case chatConstants.CLOSE_ANSWERING_MODAL:
      return {
        ...state,
        answeringModal: {
          ...state.answeringModal,
          isOpen: false,
          webRtc: {},
          caller: {},
          room: {}
        }
      };
    case chatConstants.SEARCH_USERS:
      return {
        ...state,
        searchedRooms: action.rooms
      };
    default:
      return state;
  }
}
