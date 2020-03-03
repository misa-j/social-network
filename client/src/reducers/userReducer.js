import { userConstants } from "../_constants/userConstants";
import { postConstants } from "../_constants/postConstants";
import { commentConstants } from "../_constants/commentConstants";
import { notificationConstants } from "../_constants/notificationConstants";
import { chatConstants } from "../_constants/chatConstants";

export function user(
  state = {
    loadingUser: true,
    updaingUser: false,
    deleting: false,
    hasError: false,
    data: {
      profilePicture: "person.png",
      username: "",
      notificationsCount: 0,
      messagesCount: 0,
      posts: [],
      follwingUsers: [],
      followerUsers: [],
      notifications: [],
      postLikes: []
    }
  },
  action
) {
  switch (action.type) {
    case userConstants.GETUSER_REQUEST:
      return {
        ...state,
        loadingUser: true
      };
    case userConstants.USER_UPDATE_REQUEST: {
      return {
        ...state,
        updaingUser: true
      };
    }
    case userConstants.USER_UPDATE_SUCCESS:
      const { firstName, lastName, username, email, bio } = action.user;
      return {
        ...state,
        updaingUser: false,
        hasError: false,
        data: {
          ...state.data,
          firstName,
          lastName,
          username,
          email,
          bio
        }
      };
    case userConstants.USER_UPDATE_FAILURE:
      return {
        ...state,
        updaingUser: false,
        hasError: action.error
      };
    case userConstants.GETUSER_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.user
        },
        loadingUser: false
      };
    case userConstants.USER_UPDATE_PROFILEPICTURE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          profilePicture: action.user.profilePicture
        },
        loadingUser: false
      };
    case userConstants.USER_LIKE_COMMENT:
      return {
        ...state,
        data: {
          ...state.data,
          commentLikes: [...state.data.commentLikes, action.comment.commentId]
        }
      };

    case userConstants.USER_DISLIKE_COMMENT:
      return {
        ...state,
        data: {
          ...state.data,
          commentLikes: state.data.commentLikes.filter(
            e => e !== action.comment.commentId
          )
        }
      };

    case userConstants.USER_LIKE_COMMENT_REPLY:
      return {
        ...state,
        data: {
          ...state.data,
          commentReplyLikes: [
            ...state.data.commentReplyLikes,
            action.comment.commentId
          ]
        }
      };

    case userConstants.USER_DISLIKE_COMMENT_REPLY:
      return {
        ...state,
        data: {
          ...state.data,
          commentReplyLikes: state.data.commentReplyLikes.filter(
            e => e !== action.comment.commentId
          )
        }
      };
    case commentConstants.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          posts: state.data.posts.map(post => {
            if (post._id === action.comment.post) {
              return { ...post, comments: post.comments + 1 };
            } else {
              return post;
            }
          })
        }
      };
    case postConstants.LIKE_POST:
      return {
        ...state,
        data: {
          ...state.data,
          postLikes: [...state.data.postLikes, action.post.postId],
          posts: state.data.posts.map(post => {
            if (post._id === action.post.postId) {
              return {
                ...post,
                likes: post.likes + 1
              };
            }
            return {
              ...post
            };
          })
        }
      };

    case postConstants.DISLIKE_POST:
      return {
        ...state,
        data: {
          ...state.data,
          postLikes: state.data.postLikes.filter(e => e !== action.post.postId),
          posts: state.data.posts.map(post => {
            if (post._id === action.post.postId) {
              return {
                ...post,
                likes: post.likes - 1
              };
            }
            return {
              ...post
            };
          })
        }
      };

    case userConstants.FOLLOW_USER:
      return {
        ...state,
        data: {
          ...state.data,
          followingIds: [...state.data.followingIds, action.user.userId]
        }
      };
    case userConstants.UNFOLLOW_USER:
      return {
        ...state,
        data: {
          ...state.data,
          followingIds: state.data.followingIds.filter(
            e => e !== action.user.userId
          )
        }
      };
    case userConstants.GET_POSTS:
      return {
        ...state,
        data: {
          ...state.data,
          posts: [...state.data.posts, ...action.posts]
        }
      };
    case postConstants.ADD_POST_REQUEST:
      return {
        ...state,
        posting: true
      };
    case postConstants.ADD_POST_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          posts: [action.post, ...state.data.posts],
          postsCount: state.data.postsCount + 1
        },
        posting: false
      };
    case notificationConstants.READ_NOTIFICATIOS:
      return {
        ...state,
        data: {
          ...state.data,
          notificationsCount: state.data.notificationsCount - action.readCount
        }
      };
    case postConstants.POST_DELETE_REQUEST:
      return {
        ...state,
        deleting: true
      };
    case postConstants.POST_DELETE_SUCCESS:
      return {
        ...state,

        data: {
          ...state.data,
          posts: state.data.posts.filter(post => post._id !== action.result.id),
          postsCount: state.data.postsCount - 1
        },
        deleting: false
      };

    case notificationConstants.ADD_NOTIFICATION:
      return {
        ...state,
        data: {
          ...state.data,
          notificationsCount: state.data.notificationsCount + 1
        }
      };
    case postConstants.GET_POST:
      return {
        ...state,
        openedPost: {
          ...state.openedPost,
          loadingPost: false,
          data: action.post[0]
        }
      };
    case userConstants.GET_USER_FOLLOWERS:
      return {
        ...state,
        data: {
          ...state.data,
          followerUsers: action.users
        }
      };
    case userConstants.GET_USER_FOLLOWINGS:
      return {
        ...state,
        data: {
          ...state.data,
          follwingUsers: action.users
        }
      };

    case chatConstants.INC_MESSAGE_COUNT:
      return {
        ...state,
        data: {
          ...state.data,
          messagesCount: state.data.messagesCount + 1
        }
      };
    case chatConstants.READ_MESSAGES:
      return {
        ...state,
        data: {
          ...state.data,
          messagesCount: state.data.messagesCount - action.messageIds.length
        }
      };
    default:
      return state;
  }
}
