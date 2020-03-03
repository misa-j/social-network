import { commentConstants } from "../_constants/commentConstants";
import { userConstants } from "../_constants/userConstants";
import { commentService } from "../_services/commentService";

export const commentActions = {
  addComment,
  getPostComments,
  getCommentLikes,
  getCommentReplyLikes,
  addCommentReply,
  getPostCommentReplies,
  likeComment,
  likeCommentReply
};

function addComment(params) {
  return dispatch => {
    commentService.addComment(params).then(
      res => {
        dispatch({
          type: commentConstants.INIT_REPLY_COMMENT,
          commentId: res.comment._id
        });
        dispatch(success(res.comment));
      },
      error => {
        console.log(error);
      }
    );
  };
  function success(comment) {
    return { type: commentConstants.ADD_COMMENT_SUCCESS, comment };
  }
}

function addCommentReply(params) {
  return dispatch => {
    const { commentId, postId } = params;
    commentService.addCommentReply(params).then(
      res => {
        dispatch({
          type: commentConstants.INCREASE_REPLIES_NUMBER,
          commentId,
          postId
        });

        dispatch(success(res.comment));
      },
      error => {
        console.log(error);
      }
    );
  };

  function success(comment) {
    return { type: commentConstants.ADD_REPLY_COMMENT_SUCCESS, comment };
  }
}

function getPostComments(postId, queryOptions) {
  return dispatch => {
    dispatch(request(postId));

    commentService.getPostComments(postId, queryOptions).then(
      comment => {
        comment.comments.forEach(comment => {
          dispatch({
            type: commentConstants.INIT_REPLY_COMMENT,
            commentId: comment._id
          });
        });
        dispatch(success(comment, queryOptions));
      },
      error => {
        console.log(error);
      }
    );
  };
  function request(postId) {
    return { type: commentConstants.FETCH_COMMENTS_REQUEST, postId };
  }
  function success(comment, queryOptions) {
    return {
      type: commentConstants.FETCH_COMMENTS_SUCCESS,
      comment,
      queryOptions
    };
  }
}

function getPostCommentReplies(commentId, queryOptions) {
  return dispatch => {
    dispatch(request(commentId));

    commentService.getCommentReplies(commentId, queryOptions).then(
      comment => {
        dispatch(success(comment));
      },
      error => {
        console.log(error);
      }
    );
  };
  function request(commentId) {
    return { type: commentConstants.FETCH_COMMENT_REPLIES_REQUEST, commentId };
  }
  function success(comment) {
    return { type: commentConstants.FETCH_COMMENT_REPLIES_SUCCESS, comment };
  }
}

function likeComment(params) {
  return dispatch => {
    const { commentId, postId, commentLikes } = params;
    if (commentLikes.some(e => e === commentId)) {
      dispatch(
        success(commentConstants.DISLIKE_COMMENT, { commentId, postId })
      );
      dispatch(
        success(userConstants.USER_DISLIKE_COMMENT, { commentId, postId })
      );
    } else {
      dispatch(success(commentConstants.LIKE_COMMENT, { commentId, postId }));
      dispatch(success(userConstants.USER_LIKE_COMMENT, { commentId, postId }));
    }
    commentService.likeComment(params).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };
  function success(type, comment) {
    return { type, comment };
  }
}

function likeCommentReply(params) {
  return dispatch => {
    const { commentId, commentAt, commentReplyLikes } = params;
    if (commentReplyLikes.some(e => e === commentId)) {
      dispatch(
        success(commentConstants.DISLIKE_COMMENT_REPLY, {
          commentId,
          parentId: commentAt
        })
      );
      dispatch(
        success(userConstants.USER_DISLIKE_COMMENT_REPLY, {
          commentId,
          parentId: commentAt
        })
      );
    } else {
      dispatch(
        success(commentConstants.LIKE_COMMENT_REPLY, {
          commentId,
          parentId: commentAt
        })
      );
      dispatch(
        success(userConstants.USER_LIKE_COMMENT_REPLY, {
          commentId,
          parentId: commentAt
        })
      );
    }

    commentService.likeCommentReply(params).then(
      () => {},
      error => {
        console.log(error);
      }
    );
  };
  function success(type, comment) {
    return { type, comment };
  }
}

function getCommentLikes(commentId) {
  return dispatch => {
    commentService.getCommentLikes(commentId).then(
      res => {
        dispatch(success(res.users[0].users_likes));
      },
      error => {
        console.log(error);
      }
    );
  };
  function success(commentLikes) {
    return { type: commentConstants.GET_COMMENT_LIKES, commentLikes };
  }
}

function getCommentReplyLikes(commentId) {
  return dispatch => {
    commentService.getCommentReplyLikes(commentId).then(
      res => {
        dispatch(success(res.users[0].users_likes));
      },
      error => {
        console.log(error);
      }
    );
  };
  function success(commentLikes) {
    return { type: commentConstants.GET_COMMENT_REPLY_LIKES, commentLikes };
  }
}
