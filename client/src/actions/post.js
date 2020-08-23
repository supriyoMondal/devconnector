import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_ONE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "./types";

//get post

export const getPost = () => async dispatch => {
  try {
    const res = await axios.get("/api/post");

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//get one post

export const getOnePost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/post/${id}`);

    dispatch({
      type: GET_ONE_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//Update likes
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, like: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//remove like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/unlike/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, like: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//delete post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/post/${postId}`);

    dispatch({
      type: DELETE_POST,
      payload: postId
    });
    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(`/api/post/`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    dispatch(setAlert("Post Created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//add comments
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(
      `/api/post/comment/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });
    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//delete comments
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/post/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
