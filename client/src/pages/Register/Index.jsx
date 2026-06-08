import './Index.css';
import Input from '../../shared/UI/Input/Index';
import Checkbox from '../../shared/UI/Checkbox/Index';
import Button from '../../shared/UI/Button/Index';

import { useState } from 'react';

import useRegister from '../../features/session/useRegister';

const Register = () => {
  const [credentials, setCredentials] = useState({
    fullname: '',
    login: '',
    password: '',
    gender: 'f',
    role: 'r',
  });

  const { register } = useRegister();

  return (
    <form className="register-form register-data element-decoration--panel" autoComplete="off">
      <h2 className="h-header h2-header register-form__header">Регистрация</h2>

      <section className="register-data profile-login-data">
        <Input
          onChange={({ target }) => setCredentials((prev) => ({ ...prev, fullname: target.value }))}
          name="fullname"
          placeholder="Имя..."
          value={credentials.fullname}
        ></Input>
        <Input
          onChange={({ target }) => setCredentials((prev) => ({ ...prev, login: target.value }))}
          name="login"
          placeholder="Логин..."
          value={credentials.login}
        ></Input>
        <Input
          name="password"
          onChange={({ target }) => setCredentials((prev) => ({ ...prev, password: target.value }))}
          type="password"
          placeholder="Пароль..."
          value={credentials.password}
        ></Input>
      </section>

      <section className="register-data profile-gender-data">
        <span>Ваш пол</span>
        <div className="profile-data--checkbox">
          <Checkbox
            onChange={() => setCredentials((prev) => ({ ...prev, gender: 'm' }))}
            checked={credentials.gender === 'm' ? true : false}
            name="profile-gender"
            type="radio"
            label="Мужской"
          ></Checkbox>
          <Checkbox
            onChange={() => setCredentials((prev) => ({ ...prev, gender: 'f' }))}
            checked={credentials.gender === 'f' ? true : false}
            name="profile-gender"
            type="radio"
            label="Женский"
          ></Checkbox>
        </div>
      </section>

      <section className="register-data profile-role-data">
        <span>Роль в сообществе</span>
        <div className="profile-data--checkbox">
          <Checkbox
            onChange={() => setCredentials((prev) => ({ ...prev, role: 'r' }))}
            checked={credentials.role === 'r' ? true : false}
            name="profile-role"
            type="radio"
            label="Читатель"
          ></Checkbox>
          <Checkbox
            onChange={() => setCredentials((prev) => ({ ...prev, role: 'p' }))}
            checked={credentials.role === 'p' ? true : false}
            name="profile-role"
            type="radio"
            label="Публицист"
          ></Checkbox>
        </div>
      </section>

      <Button
        className="register-form__submit"
        onClick={async (e) => {
          e.preventDefault();
          await register(credentials);
        }}
      >
        Создать аккаунт
      </Button>
      <a className="register-form__private-policy" href="#">
        Политика конфеденциальности
      </a>
    </form>
  );
};

export default Register;
