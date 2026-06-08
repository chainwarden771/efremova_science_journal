import { publishRequest } from '../../api/app/posts/publish';
import { useEffect, useState, useRef } from 'react';

import useModalContext from '../../shared/hooks/useModalContext';
import { useNavigate } from 'react-router-dom';

function usePost(DefaultPostImage) {
  const imageFileRef = useRef(null);
  const pdfFileRef = useRef(null);
  const previousUrlRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(DefaultPostImage);
  const { showModal } = useModalContext();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    imageFile: null,
    pdfFile: null,
    title: '',
    description: '',
  });

  const selectImageFile = () => {
    if (!imageFileRef.current) {
      return;
    }

    imageFileRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const handleSelectionImage = (event) => {
    if (event.target.files?.[0]) {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }

      const file = event.target.files[0];
      setPostData((prev) => ({ ...prev, imageFile: file }));
      previousUrlRef.current = URL.createObjectURL(file);
      setPreviewImage(previousUrlRef.current);
    }
  };

  const selectPdfFile = () => {
    if (!pdfFileRef.current) {
      return;
    }

    pdfFileRef.current.click();
  };

  const handleSelectionPdfFile = (event) => {
    if (event.target.files?.[0]) {
      setPostData((prev) => ({ ...prev, pdfFile: event.target.files?.[0] }));
    }
  };

  async function handleSubmit(postData) {
    try {
      // вынес сюда запрос, ты так предлагаешь ?
      const postRes = await publishRequest(postData);

      showModal({
        title: 'Создано ✅',
        text: 'Пост успешно опубликован, вы можете прочитать его на данной странице',
      });

      // Потом открыть пост в режиме чтения
      navigate(`/read/${postRes.post.id}`);
    } catch (error) {
      // Перенаправляеем пользователя на авторизацию
      if (error.response?.status === 401) {
        navigate('/auth');
      }

      showModal({
        title: '❌ Ошибка',
        text: 'Не удалось опубликовать пост',
      });

      throw error;
    }
  }

  return {
    imageFileRef,
    pdfFileRef,
    postData,
    setPostData,
    previewImage,
    selectImageFile,
    handleSelectionImage,
    selectPdfFile,
    handleSelectionPdfFile,
    handleSubmit,
  };
}

export { usePost };
