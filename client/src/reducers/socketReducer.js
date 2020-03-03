import { socketConstants } from "../_constants/socketConstants";

export function socket(state = {}, action) {
  switch (action.type) {
    case socketConstants.CONNECT:
      return {
        ...state,
        socket: action.socket
      };

    default:
      return state;
  }
}
