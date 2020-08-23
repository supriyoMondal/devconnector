import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  DELETE_ACCOUNT
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticate: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticate: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case DELETE_ACCOUNT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticate: false,
        loading: false
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticate: true,
        loading: false,
        user: payload
      };

    default:
      return state;
  }
}
