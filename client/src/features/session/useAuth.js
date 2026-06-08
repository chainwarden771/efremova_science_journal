import useProfileContext from '../../shared/hooks/useProfileContext';
import useModalContext from '../../shared/hooks/useModalContext';
import { authRequest } from '../../api/app/session';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const navigate = useNavigate();
  const { login } = useProfileContext();
  const { showModal } = useModalContext();

  async function auth(credentials) {
    try {
      // вынес сюда запрос, ты так предлагаешь ?
      const profileData = await authRequest(credentials);
      await login(profileData.profile);

      showModal({
        title: 'Добро пожаловать ✅',
        text: 'Выполнен вход в аккаунт',
      });

      navigate('/explore');
    } catch (error) {
      showModal({
        title: '❌ Ошибка',
        text: 'Не удалось выполнить вход',
      });

      throw error;
    }
  }

  // Потом дополнить выходом, ааторизацией так понимаю
  return {
    auth,
  };
}
