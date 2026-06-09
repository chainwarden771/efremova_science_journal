import './Index.css';

import ProfileIcon from '../../assets/icons/profile-icon.svg';
import RateIcon from '../../assets/icons/rate-icon.svg';
import { POST_SOURCE_URL } from '../../api/app/index';
import { Link } from 'react-router-dom';
import { useRead } from '../../features/posts/useRead';

const Read = () => {
  const rating = 0;
  const postPathParam = location.pathname.split('/')[2];
  const { post } = useRead(postPathParam);

  return (
    <div className="post-item element-decoration--panel post-item--read">
      {post._id ? (
        <>
          <div className="post-item__publisher-spine">
            <div className="publisher-area">
              <img alt="profile icon" src={ProfileIcon}></img>
              <span>{post.autorFullName}</span>
            </div>
            <span className="post-item__publish-date">
              {new Date(post.publishDate).toLocaleString('ru-RU')}
            </span>
          </div>
          <section>
            <img
              alt="post image"
              src={`${POST_SOURCE_URL}/${post.imageFileName}`}
              className="post-item__image"
            ></img>
            <h1 className="h-header h1-header post-item__header">{post.title}</h1>
            <p className="description-text">{post.description}</p>
            <iframe
              src={`${POST_SOURCE_URL}/${post.pdfFileName}`}
              className="post-item__pdf-content"
            ></iframe>
          </section>
          <div className="post-item__footer">
            <div className="post-item__rating">
              <div className="post-item__rating-shadow"></div>
              {Array.from({
                length: Math.max(0, Number(rating) || 0),
              }).map((_, indx) => {
                return <img alt="rating" src={RateIcon} key={indx}></img>;
              })}
            </div>
          </div>
          <Link className="post-item__explore" to="/explore">
            К ленте публикаций
          </Link>
        </>
      ) : (
        <span className="post-item__notice-message">Загрузка поста...</span>
      )}
    </div>
  );
};

export default Read;
