import { combineReducers } from "redux";

import { authentication } from "./authenticationReducer";
import { registration } from "./registrationReducer";
import { user } from "./userReducer";
import { alert } from "./alertReducer";
import { post } from "./postReducer";
import { comments } from "./commentReducer";
import { replies } from "./commentRepliesReducer";
import { userProfile } from "./userProfileReducer";
import { notification } from "./notificationReducer";
import { socket } from "./socketReducer";
import { postUpload } from "./postUploadPageReducer";
import { chat } from "./chatReducer";
import { newUsers } from "./newUsersReducer";
import { userConstants } from "../_constants/userConstants";

const appReducer = combineReducers({
  post,
  authentication,
  registration,
  user,
  newUsers,
  alert,
  comments,
  replies,
  userProfile,
  notification,
  socket,
  postUpload,
  chat
});

const rootReducer = (state, action) => {
  if (action.type === userConstants.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
