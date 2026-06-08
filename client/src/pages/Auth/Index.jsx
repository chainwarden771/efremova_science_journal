import './Index.css';
import Input from '../../shared/UI/Input/Index';
import Button from '../../shared/UI/Button/Index';
import useAuth from '../../features/session/useAuth';
import { useState } from 'react';

const Auth = () => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });

  const { auth } = useAuth();

  return (
    <form className="captcha-form captcha-data element-decoration--panel">
      <h2 className="h-header h2-header captcha-form__header">Авторизация</h2>

      <section className="captcha-data">
        <Input
          name="fullname"
          placeholder="Логин..."
          onChange={({ target }) => setCredentials((prev) => ({ ...prev, login: target.value }))}
          value={credentials.login}
        />
        <Input
          name="password"
          type="password"
          placeholder="Пароль..."
          onChange={({ target }) => setCredentials((prev) => ({ ...prev, password: target.value }))}
          value={credentials.password}
        />
      </section>

      {/* <section className="captcha-data">
                    <span>Введите капчу</span>
                    <div className="profile-data--captcha">
                        <img
                            src="/assets/examples/captcha-example.png"
                            alt="captcha"
                            className="captcha"
                        />
                        <Input
                            name="captcha"
                            placeholder="Текст капчи..."
                            className="captcha-data__input"
                        />
                    </div>
                </section> */}

      <Button
        className="captcha-form__submit"
        onClick={(e) => {
          e.preventDefault();
          auth(credentials);
        }}
      >
        Войти
      </Button>
    </form>
  );
};

export default Auth;
