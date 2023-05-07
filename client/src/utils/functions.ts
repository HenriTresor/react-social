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
