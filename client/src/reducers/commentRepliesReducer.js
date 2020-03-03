import { commentConstants } from "../_constants/commentConstants";

export function replies(state = { commentLikes: [] }, action) {
  switch (action.type) {
    case commentConstants.FETCH_COMMENT_REPLIES_REQUEST:
      return {
        ...state,
        [action.commentId]: {
          ...state[action.commentId],
          fetching: true
        }
      };

    case commentConstants.FETCH_COMMENT_REPLIES_SUCCESS:
      return {
        ...state,
        [action.comment.commentId]: {
          ...state[action.comment.commentId],
          fetching: false,
          comments: [
            ...state[action.comment.commentId].comments,
            ...action.comment.comments
          ]
        }
      };

    case commentConstants.INIT_REPLY_COMMENT:
      if (!state[action.commentId]) {
        return {
          ...state,
          [action.commentId]: {
            fetching: false,
            comments: []
          }
        };
      } else {
        return { ...state };
      }

    case commentConstants.ADD_REPLY_COMMENT_SUCCESS:
      return {
        ...state,
        [action.comment.commentAt]: {
          ...state[action.comment.commentAt],
          fetching: false,
          comments: [
            action.comment,
            ...state[action.comment.commentAt].comments
          ]
        }
      };

    case commentConstants.LIKE_COMMENT_REPLY:
      return {
        ...state,
        [action.comment.parentId]: {
          ...state[action.comment.parentId],
          comments: state[action.comment.parentId].comments.map(comment => {
            if (comment._id === action.comment.commentId) {
              return { ...comment, likes: comment.likes + 1 };
            } else {
              return comment;
            }
          })
        }
      };

    case commentConstants.DISLIKE_COMMENT_REPLY:
      return {
        ...state,
        [action.comment.parentId]: {
          ...state[action.comment.parentId],
          comments: state[action.comment.parentId].comments.map(comment => {
            if (comment._id === action.comment.commentId) {
              return { ...comment, likes: comment.likes - 1 };
            } else {
              return comment;
            }
          })
        }
      };

    case commentConstants.GET_COMMENT_REPLY_LIKES:
      return {
        ...state,
        commentLikes: [...state.commentLikes, ...action.commentLikes]
      };

    case "CLEAR_COMMENT_REPLY_LIKES":
      return {
        ...state,
        commentLikes: []
      };

    default:
      return state;
  }
}
