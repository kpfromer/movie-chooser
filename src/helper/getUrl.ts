export const getUrl = (route: string): string => {
  if (process.env.REACT_APP_API_URL) {
    return `${process.env.REACT_APP_API_URL}/${route}`;
  }
  return `http://localhost:3001/${route}`;
};
