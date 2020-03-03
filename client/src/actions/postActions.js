import { postConstants } from "../_constants/postConstants";
import { userConstants } from "../_constants/userConstants";
import { postService } from "../_services/postService";
import { alertActions } from "./alertActions";

export const postActions = {
  mapLoactionSelect,
  changeTextareaValue,
  canvasHasValue,
  getCroppedSrc,
  selectImage,
  fetchPosts,
  getPostsByHashtag,
  getPostsByLocation,
  deletePost,
  addPost,
  addProfiePicture,
  likePost,
  getPostLikes,
  getPost
};

function getCroppedSrc(imgSrc) {
  return dispatch => {
    dispatch({ type: postConstants.IMAGE_CROP_SELECT, imgSrc });
  };
}

function selectImage(imgSrc, imgSrcExt) {
  return dispatch => {
    dispatch({ type: postConstants.IMAGE_SELECT, imgSrc, imgSrcExt });
  };
}

function canvasHasValue(hasValue) {
  return dispatch => {
    dispatch({ type: postConstants.CANVAS_HAS_VALUE, hasValue });
  };
}

function changeTextareaValue(value) {
  return dispatch => {
    dispatch({ type: postConstants.TEXTAREA_VALUE_CAHNGE, value });
  };
}

function mapLoactionSelect(location) {
  return dispatch => {
    dispatch({ type: postConstants.MAP_LOCATION_SELECT, location });
  };
}

function addPost(postData) {
  return dispatch => {
    dispatch(request());

    postService.addPost(postData).then(
      post => {
        dispatch(success(post));
        dispatch(alertActions.success("Post uploaded"));
        dispatch({ type: postConstants.INIT_COMMENT, postId: post._id });
      },
      error => {
        dispatch(alertActions.error(error));
      }
    );
  };
  function request() {
    return { type: postConstants.ADD_POST_REQUEST };
  }
  function success(post) {
    return { type: postConstants.ADD_POST_SUCCESS, post };
  }
}

function addProfiePicture(postData) {
  return dispatch => {
    dispatch(request());

    postService.addProfiePicture(postData).then(
      res => {
        dispatch(success(res.user));
      },
      error => {
        console.log(error);
      }
    );
  };

  function request() {
    return { type: userConstants.GETUSER_REQUEST };
  }
  function success(user) {
    return { type: userConstants.USER_UPDATE_PROFILEPICTURE_SUCCESS, user };
  }
}

function fetchPosts(queryParams) {
  return dispatch => {
    //dispatch(request());

    postService.fetchPosts(queryParams).then(
      response => {
        if (queryParams.initialFetch) {
          const { posts, total } = response[0];
          posts.forEach(post =>
            dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
          );
          dispatch(success(posts, total[0], queryParams.initialFetch));
        } else {
          dispatch(success(response));
          response.forEach(post =>
            dispatch({ type: postConstants.INIT_COMMENT, postId: post._id })
          );
        }
      },
      error => {
        dispatch(alertActions.error(error));
      }
    );
  };

  function success(posts, total, initialFetch) {
    return { type: postConstants.POSTS_SUCCESS, posts, total, initialFetch };
  }
}

function deletePost(postId) {
  return dispatch => {
    dispatch(request());

    postService.deletePost(postId).then(
      res => {
        dispatch(success(res));
        dispatch(alertActions.success(res.message));
      },
      error => {
        console.log(error);
      }
    );
  };

  function request() {
    return { type: postConstants.POST_DELETE_REQUEST };
  }
  function success(result) {
    return { type: postConstants.POST_DELETE_SUCCESS, result };
  }
}

function likePost(postId, auhtorId, postLikes) {
  return dispatch => {
    if (postLikes.some(e => e === postId)) {
      dispatch(success(postConstants.DISLIKE_POST, { postId }));
    } else {
      dispatch(success(postConstants.LIKE_POST, { postId }));
    }
    postService.likePost(postId, auhtorId).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };

  function success(type, post) {
    return { type, post };
  }
}

function getPostLikes(postId) {
  return dispatch => {
    postService.getPostLikes(postId).then(
      res => {
        dispatch(success(res.users[0].users_likes));
      },
      error => {
        console.log(error);
      }
    );
  };
  function success(postLikes) {
    return { type: postConstants.GET_POST_LIKES, postLikes };
  }
}

function getPost(postId) {
  return dispatch => {
    postService.getPost(postId).then(
      response => {
        document.title =
          response.post[0].author[0].username + "'s post | social-network";
        dispatch(success(postConstants.GET_POST, response.post));
        dispatch({
          type: postConstants.INIT_COMMENT,
          postId: response.post[0]._id
        });
      },
      error => {
        dispatch(alertActions.error(error));
        console.log(error);
      }
    );
  };
  function success(type, post) {
    return { type, post };
  }
}

function getPostsByHashtag(hashtag, queryParams) {
  return dispatch => {
    dispatch(request(queryParams.initialFetch));

    postService.getPostsByHashtag(hashtag, queryParams).then(
      response => {
        if (queryParams.initialFetch) {
          const { posts, total } = response[0];
          dispatch(success(posts, total[0], queryParams.initialFetch, hashtag));
        } else {
          dispatch(success(response));
        }
      },
      error => {
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(initialFetch) {
    return { type: postConstants.HASHTAG_POSTS_REQUEST, initialFetch };
  }
  function success(posts, total, initialFetch, hashtag) {
    return {
      type: postConstants.HASHTAG_POSTS_SUCCESS,
      posts,
      total,
      initialFetch,
      hashtag
    };
  }
}

function getPostsByLocation(coordinates, queryParams) {
  return dispatch => {
    dispatch(request(queryParams.initialFetch));

    postService.getPostsByLocation(coordinates, queryParams).then(
      response => {
        if (queryParams.initialFetch) {
          const { posts, total } = response[0];
          dispatch(
            success(posts, total[0], queryParams.initialFetch, coordinates)
          );
        } else {
          dispatch(success(response));
        }
      },
      error => {
        dispatch(alertActions.error(error));
      }
    );
  };

  function request(initialFetch) {
    return { type: postConstants.LOCATION_POSTS_REQUEST, initialFetch };
  }
  function success(posts, total, initialFetch, coordinates) {
    return {
      type: postConstants.LOCATION_POSTS_SUCCESS,
      posts,
      total,
      initialFetch,
      coordinates
    };
  }
}
