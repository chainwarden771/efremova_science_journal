import { appInstance } from '..';

export const registerRequest = async ({ fullname, login, password, gender, role }) => {
  const response = await appInstance.post('session/register', {
    credentials: {
      fullname,
      login,
      password,
      gender,
      role,
    },
  });

  return response.data;
};
