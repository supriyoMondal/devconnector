import {
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_ONE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../actions/types";

const initialSte = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};
export default function(state = initialSte, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POST:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_ONE_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? { ...post, like: payload.like } : post
        ),
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(cmnt => cmnt._id !== payload),
          loading: false
        }
      };
    default:
      return state;
  }
}
