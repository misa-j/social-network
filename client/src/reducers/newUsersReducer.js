import { userConstants } from "../_constants/userConstants";

const initialState = {
  users: [],
  fetching: true,
  fetchingNewUsers: false,
  usersCount: 0
};

export function newUsers(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_NEW_USERS_SUCCESS:
      if (action.data.initialFetch) {
        return {
          ...state,
          users: [...action.data.users, ...state.users],
          usersCount: action.data.usersCount,
          fetching: false
        };
      }
      return {
        ...state,
        users: [...state.users, ...action.data.users],
        fetchingNewUsers: false
      };
    case userConstants.GET_NEW_USERS_REQUEST:
      return {
        ...state,
        fetchingNewUsers: true
      };
    case userConstants.NEW_USER:
      return {
        ...state,
        users: [action.user, ...state.users],
        usersCount: state.usersCount + 1
      };
    default:
      return state;
  }
}
