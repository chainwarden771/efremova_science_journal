import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { exploreRequest } from '../../api/app/posts/explore';
import { toDateInputValue } from '../../shared/utils/toDateInputValue';

const useExplore = (showModal) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 3,
    title: searchParams.get('title') || '',
    dateFrom: searchParams.get('dateFrom') ? Number(searchParams.get('dateFrom')) : null,
    dateTo: searchParams.get('dateTo') ? Number(searchParams.get('dateTo')) : null,
  });

  const [postPag, setPostPag] = useState({
    posts: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filter.page !== 1) params.set('page', filter.page.toString());
    if (filter.limit !== 3) params.set('limit', filter.limit.toString());
    if (filter.title) params.set('title', filter.title);
    if (filter.dateFrom) params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params.set('dateTo', filter.dateTo);

    setSearchParams(params);
  }, [filter, setSearchParams]);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const data = await exploreRequest(filter);
        setPostPag(data);
      } catch (error) {
        showModal({
          title: '❌ Ошибка',
          text: 'Не удалось загрузить посты. Обновите страницу.',
        });

        throw error;
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [filter, showModal]);

  const handlePrevPage = () => {
    if (!postPag.pagination?.hasPrevPage) return;
    setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleNextPage = () => {
    if (!postPag.pagination?.hasNextPage) return;
    setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleDateFilter = ({ target }) => {
    if (!target.value) {
      setFilter((prev) => ({ ...prev, dateFrom: null, dateTo: null }));
      return;
    }
    const unixDate = new Date(target.value).getTime();
    setFilter((prev) => ({ ...prev, dateFrom: unixDate, dateTo: unixDate }));
  };

  const handleNameFilter = ({ target }) => {
    setFilter((prev) => ({ ...prev, title: target.value }));
  };

  const resetFilters = () => {
    setFilter((prev) => ({ ...prev, title: '', dateFrom: null, dateTo: null, page: 1 }));
  };

  return {
    postPag,
    loading,
    filter,
    setFilter,
    handlePrevPage,
    handleNextPage,
    handleDateFilter,
    handleNameFilter,
    resetFilters,
    toDateInputValue,
  };
};

export default useExplore;
