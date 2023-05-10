import axios from "axios";
import { rootLink } from "./links";

export const createPost = async (author, post_content) => {
  try {
    const res = await axios.post(`${rootLink}/api/posts`, {
      author,
      post_content,
    });

    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const sendFriendRequest = async (userId: string, requestId: string) => {
  try {
    const res = await axios.post(`${rootLink}/api/friends/${userId}`, {
      requestId,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const confirmRequest = async (userId, requesterId) => {
  try {
    const res = await axios.patch(`${rootLink}/api/friends/${userId}`, {
      requesterId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const likePost = async (userId, postId) => {
  try {
    const res = await axios.post(`${rootLink}/api/posts/like`, {
      userId,
      postId,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
    };
  }
};

export const addComment = async (userId, postId, comment) => {
  try {
    const res = await axios.post(`${rootLink}/api/posts/${postId}/comments`, {
      userId: userId,
      comment: comment,
    });

    return res.data;
  } catch (error) {
    return {
      message: error.response.data.message,
    };
  }
};
