import { userConstants } from "../_constants/userConstants";
import { postConstants } from "../_constants/postConstants";
import { userService } from "../_services/userService";
import { alertActions } from "./alertActions";
import { history } from "../_helpers/history";

export const userActions = {
  login,
  logout,
  register,
  sendVerificationEmail,
  getUserData,
  getUserProfileFollowers,
  getUserProfileFollowings,
  getFollowers,
  getPosts,
  getUserPosts,
  getFollowings,
  updateUserData,
  followUser,
  sendforgotPasswordEmail,
  getUserProfileData,
  getNewUsers,
  resetPassword,
};

function logout() {
  userService.logout();
  return (dispatch) => {
    dispatch({ type: userConstants.LOGOUT });
  };
}

function resetPassword(data) {
  return (dispatch) => {
    dispatch(request());
    userService.resetPassword(data).then(
      (res) => {
        dispatch(alertActions.success(res.message));
        dispatch(response());
      },
      (error) => {
        dispatch(alertActions.error(error));
        dispatch(response());
      }
    );
  };

  function response() {
    return { type: userConstants.PASSWORD_RESET_RESPONSE };
  }
  function request() {
    return { type: userConstants.PASSWORD_RESET_REQUEST };
  }
}

function getNewUsers(params) {
  return (dispatch) => {
    if (!params.initialFetch) {
      dispatch(request());
    }
    userService.getNewUsers(params).then(
      (res) => {
        dispatch(success({ ...res, ...params }));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(data) {
    return { type: userConstants.GET_NEW_USERS_SUCCESS, data };
  }
  function request() {
    return { type: userConstants.GET_NEW_USERS_REQUEST };
  }
}

function sendVerificationEmail(email) {
  return (dispatch) => {
    userService.sendVerificationEmail(email).then(
      (res) => {
        dispatch(alertActions.success(res.message));
      },
      (error) => {
        dispatch(alertActions.error(error));
      }
    );
  };
}

function sendforgotPasswordEmail(email) {
  return (dispatch) => {
    userService.sendforgotPasswordEmail(email).then(
      (res) => {
        dispatch(alertActions.success(res.message));
      },
      (error) => {
        dispatch(alertActions.error(error));
      }
    );
  };
}

function login(email, password) {
  return (dispatch) => {
    dispatch(request({ email }));

    userService.login(email, password).then(
      (user) => {
        dispatch(success(user.token));
        dispatch({ type: userConstants.GETUSER_SUCCESS, user });
        history.push("/");
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (data) => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success(data.message));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getUserData(queryParams) {
  return (dispatch) => {
    dispatch(request());

    userService.getUserData(queryParams).then(
      (res) => {
        res.user.posts &&
          res.user.posts.forEach((post) =>
            dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
          );
        dispatch(success(res.user));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return { type: userConstants.GETUSER_REQUEST };
  }
  function success(user) {
    return { type: userConstants.GETUSER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.GETUSER_FAILURE, error };
  }
}

function getPosts(queryParams) {
  return (dispatch) => {
    userService.getPosts(queryParams).then(
      (res) => {
        res.posts.forEach((post) =>
          dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
        );
        dispatch(success(res.posts));
      },
      (error) => {
        dispatch(alertActions.error(error));
      }
    );
  };

  function success(posts) {
    return { type: userConstants.GET_POSTS, posts };
  }
}

function getUserPosts(queryParams) {
  return (dispatch) => {
    userService.getPosts(queryParams).then(
      (res) => {
        res.posts.forEach((post) =>
          dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
        );
        dispatch(success(res.posts));
      },
      (error) => {
        dispatch(alertActions.error(error));
      }
    );
  };

  function success(posts) {
    return { type: userConstants.GET_USER_PROFILE_POSTS, posts };
  }
}

function updateUserData(user) {
  return (dispatch) => {
    dispatch(request());

    userService.updateUser(user).then(
      (data) => {
        dispatch(success(data.user));
      },
      (error) => {
        dispatch(failure(error.toString()));
        //dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return { type: userConstants.USER_UPDATE_REQUEST };
  }
  function success(user) {
    return { type: userConstants.USER_UPDATE_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.USER_UPDATE_FAILURE, error };
  }
}

function followUser(user) {
  return (dispatch) => {
    userService.followUser(user).then(
      (user) => {
        if (user.action === "followed") {
          dispatch({ type: userConstants.FOLLOW_USER, user });
        } else {
          dispatch({ type: userConstants.UNFOLLOW_USER, user });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
}

function getUserProfileData(username) {
  return (dispatch) => {
    dispatch(request());
    userService.getUserProfileData(username).then(
      (response) => {
        // if logged in user requested its profile

        if (response.user.loggedInUser) {
          return history.push("/profile");
        }
        document.title = "@" + response.user.username + " | social-network";
        dispatch(success(response));
        response.user.posts &&
          response.user.posts.forEach((post) =>
            dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
          );
      },
      (error) => {
        console.log(error);
        dispatch(failure());
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request() {
    return { type: userConstants.GET_USERPROFILE_DATA_REQUEST };
  }
  function success(user) {
    return { type: userConstants.GET_USERPROFILE_DATA, user };
  }
  function failure() {
    return { type: userConstants.GET_USERPROFILE_DATA_FAILURE };
  }
}

function getUserProfileFollowings(userId) {
  return (dispatch) => {
    userService.getUserProfileFollowings(userId).then(
      (response) => {
        dispatch(success(response.users[0].following));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(users) {
    return { type: userConstants.GET_USER_PROFILE_FOLLOWINGS, users };
  }
}

function getUserProfileFollowers(userId) {
  return (dispatch) => {
    userService.getUserProfileFollowers(userId).then(
      (response) => {
        dispatch(success(response.users[0].followers));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(users) {
    return { type: userConstants.GET_USER_PROFILE_FOLLOWERS, users };
  }
}

function getFollowings(userId) {
  return (dispatch) => {
    userService.getUserProfileFollowings(userId).then(
      (response) => {
        dispatch(success(response.users[0].following));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(users) {
    return { type: userConstants.GET_USER_FOLLOWINGS, users };
  }
}

function getFollowers(userId) {
  return (dispatch) => {
    userService.getUserProfileFollowers(userId).then(
      (response) => {
        dispatch(success(response.users[0].followers));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  function success(users) {
    return { type: userConstants.GET_USER_FOLLOWERS, users };
  }
}
