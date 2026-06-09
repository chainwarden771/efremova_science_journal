import { appInstance } from '..';

export const exploreRequest = async ({ page, limit, title, dateFrom, dateTo }) => {
  const params = new URLSearchParams();

  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (title) params.append('title', title);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const queryString = params.toString();
  const url = `/posts/explore/${queryString ? '?' + queryString : ''}`;

  const response = await appInstance.get(url);
  return response.data;
};
