import useProfileContext from '../../shared/hooks/useProfileContext';
import useModalContext from '../../shared/hooks/useModalContext';
import { registerRequest } from '../../api/app/session';
import { useNavigate } from 'react-router-dom';

export default function useRegister() {
  const navigate = useNavigate();
  const { login } = useProfileContext();
  const { showModal } = useModalContext();

  async function register(credentials) {
    try {
      // вынес сюда запрос, ты так предлагаешь ?
      const profileData = await registerRequest(credentials);
      await login(profileData.profile);

      showModal({
        title: 'Добро пожаловать ✅',
        text: 'Аккаунт успешно создан',
      });

      navigate('/explore');
    } catch (error) {
      showModal({
        title: '❌ Ошибка',
        text: 'Не удалось создать аккаунт',
      });

      throw error;
    }
  }

  // Потом дополнить выходом, ааторизацией так понимаю
  return {
    register,
  };
}
