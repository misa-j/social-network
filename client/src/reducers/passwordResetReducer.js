import { userConstants } from "../_constants/userConstants";

export function passwordReset(
  state = {
    requesting: false,
  },
  action
) {
  switch (action.type) {
    case userConstants.PASSWORD_RESET_REQUEST:
      return { ...state, requesting: true };
    case userConstants.PASSWORD_RESET_RESPONSE:
      return { ...state, requesting: false };
    default:
      return state;
  }
}
