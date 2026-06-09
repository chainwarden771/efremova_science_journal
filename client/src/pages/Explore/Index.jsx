// components/Explore/Index.jsx
import './Index.css';
import { useNavigate } from 'react-router-dom';
import FilterIcon from '../../assets/icons/filter_alt.svg';
import Post from '../../components/Post/Index';
import Button from '../../shared/UI/Button/Index';
import Input from '../../shared/UI/Input/Index';
import useExplore from '../../features/posts/useExplore';
import useModalContext from '../../shared/hooks/useModalContext';
import crystalIcon from '../../assets/icons/crystal.png';

const Explore = () => {
  const navigate = useNavigate();
  const { showModal } = useModalContext();

  const {
    postPag,
    loading,
    filter,
    handlePrevPage,
    handleNextPage,
    handleDateFilter,
    handleNameFilter,
    resetFilters,
    toDateInputValue,
  } = useExplore(showModal);

  return (
    <div className="explore-posts">
      <div className="filter-toolbar">
        <img className="filter-toolbar--icon" src={FilterIcon}></img>
        <Input
          type="date"
          value={toDateInputValue(filter.dateFrom)}
          onChange={handleDateFilter}
          className="filter-toolbar__date input--filter"
        />
        <Input
          value={filter.title}
          onChange={handleNameFilter}
          placeholder="Введите имя или название..."
          className="filter-toolbar__search input--filter"
        />
        <Button onClick={resetFilters} className="filter-toolbar__button--rem-filter">
          Сбросить
        </Button>
      </div>

      <div className="publish-invoice-message element-decoration--panel">
        <section>
          <img alt="logo" className="publish-logo" src={crystalIcon}></img>
          <h1 className="h-header h1-header post-invoice-header">Создайте свою публикацию</h1>
          <p className="description-text">
            Для этого нажмите на "Опубликовать" ниже, дальше следуйте инструкции на странице
            публикации, привлеките внимание потенциального читателя броским заголовком
          </p>
          <Button onClick={() => navigate('/publish')} className="publish-invoice__button">
            Опубликовать
          </Button>
        </section>
      </div>

      {!loading ? (
        postPag.posts && postPag.posts.length ? (
          postPag.posts.map((post) => (
            <Post
              key={post._id}
              postID={post._id}
              headline={post.title}
              description={post.description}
              imageURL={post.imageFileName}
              publisherFullname={post.autorFullName}
              publishDate={post.publishDate}
            />
          ))
        ) : (
          <div className="post-item element-decoration--panel">
            <span className="post-item__notice-message">Посты не найдены</span>
          </div>
        )
      ) : (
        <div className="post-item element-decoration--panel">
          <span className="post-item__notice-message">Загрузка постов...</span>
        </div>
      )}

      <div className="explore-posts__pagination element-decoration--panel">
        <Button disabled={!postPag.pagination?.hasPrevPage} onClick={handlePrevPage}>
          ← Назад
        </Button>

        <span>
          Страница {postPag.pagination?.currentPage ?? 1}
          {' / '}
          {postPag.pagination?.totalPages ?? 1}
        </span>

        <Button disabled={!postPag.pagination?.hasNextPage} onClick={handleNextPage}>
          Вперед →
        </Button>
      </div>
    </div>
  );
};

export default Explore;
