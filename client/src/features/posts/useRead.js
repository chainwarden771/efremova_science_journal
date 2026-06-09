import useModalContext from '../../shared/hooks/useModalContext';
import { readRequest } from '../../api/app/posts/read';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useRead(postPathParam) {
  const navigate = useNavigate();
  const { showModal } = useModalContext();
  const [post, setPost] = useState({
    _id: null,
    title: '',
    description: '',
    publishDate: null,
    imageFileName: '',
    pdfFileName: '',
    autorFullName: '',
  });

  useEffect(() => {
    const loadPost = async (postID) => {
      try {
        const postData = await readRequest({ postID });
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

  return {
    post,
  };
}

export { useRead };
