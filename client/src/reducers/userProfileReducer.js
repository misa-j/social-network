import { userConstants } from "../_constants/userConstants";
import { postConstants } from "../_constants/postConstants";
import { commentConstants } from "../_constants/commentConstants";

const initialState = {
  loadingUser: true,
  data: {
    profilePicture: "person.png",
    posts: [],
    follwingUsers: [],
    followerUsers: []
  }
};

export function userProfile(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_USERPROFILE_DATA_REQUEST:
      return {
        ...state,
        ...initialState
      };

    case userConstants.GET_USERPROFILE_DATA:
      return {
        ...state,
        loadingUser: false,
        data: {
          ...state.data,
          ...action.user.user
        }
      };
    case userConstants.GET_USERPROFILE_DATA_FAILURE:
      return {
        ...state,
        loadingUser: false
      };
    case userConstants.GET_USER_PROFILE_FOLLOWINGS:
      return {
        ...state,
        data: {
          ...state.data,
          follwingUsers: action.users
        }
      };
    case userConstants.GET_USER_PROFILE_POSTS:
      return {
        ...state,
        data: {
          ...state.data,
          posts: [...state.data.posts, ...action.posts]
        }
      };

    case userConstants.GET_USER_PROFILE_FOLLOWERS:
      return {
        ...state,
        data: {
          ...state.data,
          followerUsers: action.users
        }
      };
    case postConstants.LIKE_POST:
      return {
        ...state,
        data: {
          ...state.data,
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
      if (action.user.userId === state.data._id) {
        return {
          ...state,
          data: {
            ...state.data,
            followers: state.data.followers + 1
          }
        };
      } else {
        return {
          ...state
        };
      }
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
    case userConstants.UNFOLLOW_USER:
      if (action.user.userId === state.data._id) {
        return {
          ...state,
          data: {
            ...state.data,
            followers: state.data.followers - 1
          }
        };
      } else {
        return {
          ...state
        };
      }
    default:
      return state;
  }
}
