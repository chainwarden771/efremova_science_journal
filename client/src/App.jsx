import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome/Index';
import Register from './pages/Register/Index';
import Auth from './pages/Auth/Index';
import Explore from './pages/Explore/Index';
import Publish from './pages/Publish/Index';
import Read from './pages/Read/Index';

import NcfuLogo from './assets/icons/logo-ncfu-round-blue.svg';
import Header from './components/Header/Index';

function App() {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<Welcome />}></Route>
            {/* Страница Регистрации */}
            <Route path="/register" element={<Register />}></Route>
            {/* Страница Авторизации */}
            <Route path="/auth" element={<Auth />}></Route>
            {/* Страница Просмотра постов */}
            <Route path="/explore" element={<Explore />}></Route>
            {/* Страница Создание поста */}
            <Route path="/publish" element={<Publish />}></Route>
            {/* Страница Просмотра поста */}
            <Route path="/read/:id" element={<Read />}></Route>
          </Routes>
        </main>

        <footer>
          <img
            className="footer-logo foooter-ncfu-logo"
            alt="ncfu university logo"
            src={NcfuLogo}
          ></img>
          <span>Сайт разработан в рамках курсовой работы, студенткой ПИЖ-б-о-22-1 Софией</span>
          <div className="footer-more">
            <a href="#" className="footer-contact-1">
              Контакт Telegram
            </a>
            <span>2026, MIT LICENSE</span>
          </div>
        </footer>
      </Router>
    </>
  );
}

export default App;
