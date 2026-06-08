import ProfileContext from './ProfileContext';
import { useState, useEffect, useCallback } from 'react';
import { removeUser, saveUser } from '../utils/localStorage';
import { loadUser } from '../utils/localStorage';
import { AUTH_REQUIRED } from '../../shared/consts/statusMessages';

export default function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadUser());
  const [loading, setLoading] = useState(false);

  async function login(profileData) {
    setLoading(true);

    try {
      saveUser(profileData);
      setProfile(profileData);

      return profileData;
    } finally {
      setLoading(false);
    }
  }

  const logout = useCallback(() => {
    removeUser();
    setProfile(null);
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_REQUIRED, logout);

    return () => {
      window.removeEventListener(AUTH_REQUIRED, logout);
    };
  }, [logout]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
