import './Index.css';

import useModalContext from '../../shared/hooks/useModalContext';
import { readRequest } from '../../api/app/posts/read';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import RateIcon from '../../assets/icons/rate-icon.svg';
import { useEffect, useState } from 'react';
import { POST_SOURCE_URL } from '../../api/app/index';
import { useNavigate } from 'react-router-dom';

const Read = () => {
  const headline = 'Природа Астралии';
  const description = `Задумывались ли вы когда-то о величии природы изолированной Австралии ? Астралия стала изолированным архипелагом, давшим начала многим видам, которые затем распространились по всему земному Шару.Примером такого вида может быть полевой крот, который устраивает ночью облаву на своих диких хищных сородичей...`;
  const imageURL = '../assets/examples/post-image-example.jpg';
  const rating = 0;
  const postID = '6a259f28ef552b7dcdcf611d';
  const publisherFullname = 'Иванов Иван Иванович';
  const publishDate = 1780423445741;
  const pdfFileURL = '../assets/example-doc.pdf';

  const postPathParam = location.pathname.split('/')[2];
  console.log(postPathParam);

  const navigate = useNavigate();
  const { showModal } = useModalContext();
  const [post, setPost] = useState({
    _id: null,
    title: '',
    description: '',
    publishDate: null,
    imageFileName: '',
    pdfFileName: '',
    autor: '',
  });

  useEffect(() => {
    const loadPost = async (postID) => {
      try {
        const postData = await readRequest({ postID });
        console.log(postData);
        setPost(postData);
      } catch (error) {
        showModal({
          title: '❌ Ошибка',
          text: 'Не удалось найти такой пост',
        });

        navigate('/explore');
        throw error;
      }
    };

    loadPost(postPathParam);
  }, []);

  return (
    <div className="post-item element-decoration--panel">
      {post._id ? (
        <>
          <div className="post-item__publisher-spine">
            <div className="publisher-area">
              <img alt="profile icon" src={ProfileIcon}></img>
              <span>{post.autor}</span>
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
            <iframe src={pdfFileURL} className="post-item__pdf-content"></iframe>
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
        </>
      ) : (
        <span>Загрузка поста...</span>
      )}
    </div>
  );
};

export default Read;
