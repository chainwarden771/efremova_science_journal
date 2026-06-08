import { appInstance } from '..';

export const readRequest = async ({ postID }) => {
  const response = await appInstance.get(`posts/read/${postID}`);
  return response.data;
};
