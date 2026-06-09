export const toDateInputValue = (timestamp) => {
  const date = new Date(Number(timestamp));
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};
