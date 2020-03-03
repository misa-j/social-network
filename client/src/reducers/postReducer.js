import { postConstants } from "../_constants/postConstants";
import { commentConstants } from "../_constants/commentConstants";

const initialState = {
  posts: [],
  postsByHashtag: [],
  postsByLocation: [],
  totalPosts: 0,
  totalPostsByHashtag: 0,
  totalPostsByLocation: 0,
  coordinates: null,
  hashtag: null,
  postLikes: [],
  post: {
    fetching: true
  },
  fetching: false,
  deleting: false,
  posting: false
};

export function post(state = initialState, action) {
  switch (action.type) {
    case postConstants.POSTS_REQUEST:
      return {
        ...state,
        fetching: true
      };
    case postConstants.LOCATION_POSTS_REQUEST:
      if (action.initialFetch) {
        return {
          ...state,
          postsByLocation: [],
          totalPostsByLocation: 0,
          coordinates: null
        };
      }
      return {
        ...state
      };
    case postConstants.HASHTAG_POSTS_REQUEST:
      if (action.initialFetch) {
        return {
          ...state,
          postsByHashtag: [],
          totalPostsByHashtag: 0,
          hashtag: null
        };
      }
      return {
        ...state
      };
    case postConstants.POSTS_SUCCESS:
      if (action.initialFetch) {
        return {
          ...state,
          posts: action.posts,
          totalPosts: action.total.count,
          fetching: false
        };
      }
      return {
        ...state,
        posts: [...state.posts, ...action.posts],
        fetching: false
      };
    case postConstants.HASHTAG_POSTS_SUCCESS:
      if (action.initialFetch) {
        return {
          ...state,
          postsByHashtag: action.posts,
          hashtag: action.hashtag,
          totalPostsByHashtag: action.total.count,
          fetching: false
        };
      }
      return {
        ...state,
        postsByHashtag: [...state.postsByHashtag, ...action.posts],
        fetching: false
      };
    case postConstants.LOCATION_POSTS_SUCCESS:
      if (action.initialFetch) {
        return {
          ...state,
          postsByLocation: action.posts,
          coordinates: action.coordinates,
          totalPostsByLocation: action.total.count,
          fetching: false
        };
      }
      return {
        ...state,
        postsByLocation: [...state.postsByLocation, ...action.posts],
        fetching: false
      };
    case postConstants.GET_POST_LIKES:
      return {
        ...state,
        postLikes: [...state.postLikes, ...action.postLikes]
      };
    case "CLEAR_POSTS":
      return {
        ...state,
        ...initialState
      };
    case "CLEAR_POST_LIKES":
      return {
        ...state,
        postLikes: []
      };

    case postConstants.POST_DELETE_REQUEST:
      return {
        ...state,
        deleting: true
      };
    case postConstants.POST_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        post: {
          fetching: true
        }
      };
    case commentConstants.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.comment.post) {
            return { ...post, comments: post.comments + 1 };
          } else {
            return post;
          }
        }),
        post: {
          ...state.post,
          comments: state.post.comments + 1
        }
      };

    case postConstants.LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.post.postId) {
            return { ...post, likes: post.likes + 1 };
          } else {
            return post;
          }
        }),
        post: {
          ...state.post,
          likes: state.post.likes + 1
        }
      };
    case postConstants.DISLIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.post.postId) {
            return { ...post, likes: post.likes - 1 };
          } else {
            return post;
          }
        }),
        post: {
          ...state.post,
          likes: state.post.likes - 1
        }
      };
    case postConstants.GET_POST:
      return {
        ...state,
        post: { ...action.post[0], fetching: false }
      };
    default:
      return state;
  }
}
