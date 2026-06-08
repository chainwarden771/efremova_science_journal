import './Index.css';
import Input from '../../shared/UI/Input/Index';
import Button from '../../shared/UI/Button/Index';
import Textarea from '../../shared/UI/TextArea/Index';

import DefaultPostImage from '../../assets/default-post-image.png';
import PdfFileIcon from '../../assets/pdf-icon.png';

import { usePost } from '../../features/posts/usePost';

const Publish = () => {
  const {
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
  } = usePost(DefaultPostImage);

  const isPostComplete = Object.values(postData).every(Boolean);

  return (
    <form className="publish-form publish-data element-decoration--panel">
      <div className="publish-form__preview-wrapper" onClick={selectImageFile}>
        <input
          ref={imageFileRef}
          onChange={handleSelectionImage}
          className="publish-form__select-image"
          type="file"
          accept=".png, .jpg, .webp, .jpeg, .gif"
        ></input>
        <img
          className={
            'publish-form__image publish-form__preview-image' +
            (previewImage === DefaultPostImage ? '' : '--selected')
          }
          src={previewImage}
          alt="preview image"
        />
      </div>

      <section className="publish-data">
        <span>Название для статьи</span>
        <Input
          name="post-title"
          placeholder="Велеколепные пейзажи пустыни сахары..."
          value={postData.title}
          onChange={({ target }) => setPostData((prev) => ({ ...prev, title: target.value }))}
        ></Input>
        <span>Описание статьи</span>
        <Textarea
          name="post-description"
          placeholder="Особые климатические условия данного региона..."
          value={postData.description}
          onChange={({ target }) => setPostData((prev) => ({ ...prev, description: target.value }))}
        ></Textarea>
      </section>

      <section className="publish-data">
        <div
          className="publish-data__select-file-wrapper"
          onClick={selectPdfFile}
          title={postData.pdfFile ? postData.pdfFile.name : ''}
        >
          <input
            ref={pdfFileRef}
            onChange={handleSelectionPdfFile}
            type="file"
            accept=".pdf"
            className="publish-data__select-file"
          ></input>
          <img alt="pdf file icon" src={PdfFileIcon} className="publish-data__pdf-icon"></img>
          {postData.pdfFile ? (
            <span className="publish-data__file-name">{postData.pdfFile.name}</span>
          ) : (
            ''
          )}
        </div>
      </section>

      <Button
        disabled={!isPostComplete}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(postData);
        }}
        className="publish-form__submit"
      >
        Опубликовать
      </Button>
    </form>
  );
};

export default Publish;
