import { appInstance } from '..';

export const authRequest = async ({ login, password }) => {
  const response = await appInstance.post('session/auth', {
    credentials: {
      login,
      password,
    },
  });

  return response.data;
};
