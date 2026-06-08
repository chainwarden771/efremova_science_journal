import './Index.css';
import GraduationHat from '../../assets/graduation-hat.png';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import { Link } from 'react-router-dom';

import useProfileContext from '../../shared/hooks/useProfileContext';

const Header = () => {
  //ВРЕМЕННЫЙ ЛОГИН
  const { profile, logout } = useProfileContext();

  return (
    <header>
      <img className="header-logo" alt="graduation-hat" src={GraduationHat}></img>
      <span className="header-text">Агрегатор научных статей</span>
      <div className="header-profile">
        {profile ? (
          <>
            <img alt="profile icon" src={ProfileIcon}></img>
            <span className="profile-info">{profile.fullname}</span>
          </>
        ) : (
          <>
            <Link className="profile-action--login" to="/auth">
              Вход
            </Link>
            <span>/</span>
            <Link className="profile-action--register" to="/register">
              Регистрация
            </Link>
          </>
        )}

        {profile ? (
          <>
            <span>/</span>
            <Link className="profile-action--logout" onClick={() => logout()} to="/">
              Выйти
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;
