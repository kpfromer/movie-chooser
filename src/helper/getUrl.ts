export const getUrl = (defaultUrl: string): string => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return defaultUrl;
};
