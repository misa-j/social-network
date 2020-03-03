import { userConstants } from "../_constants/userConstants";

const initialState = {
  users: [],
  fetching: true
};

export function newUsers(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_NEW_USERS_SUCCESS:
      return {
        ...state,
        users: [...action.users, ...state.users],
        fetching: false
      };
    case userConstants.NEW_USER:
      return {
        ...state,
        users: [action.user, ...state.users]
      };
    default:
      return state;
  }
}
