import { appInstance } from '..';

export const publishRequest = async ({ imageFile, pdfFile, title, description }) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('pdf', pdfFile);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const metadata = JSON.stringify({
    post: {
      title,
      description,
    },
  });

  formData.append('metadata', metadata);
  const response = await appInstance.post('posts/publish', formData, config);
  return response.data;
};
