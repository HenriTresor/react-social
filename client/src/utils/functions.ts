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
  }
};
