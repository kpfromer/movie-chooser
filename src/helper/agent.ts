import superagent from "superagent";
// import { commonStore, globalDispatch } from "..";

const encode = encodeURIComponent;

const getUrl = (defaultUrl: string) => (route: string): string => {
  let url = "";
  if (!!process.env.REACT_APP_API_URL) {
    if (process.env.REACT_APP_API_URL.endsWith("/")) {
      // Remove ending "/"
      url = process.env.REACT_APP_API_URL.slice(0, -1);
    } else {
      url = process.env.REACT_APP_API_URL;
    }
  } else {
    if (defaultUrl.endsWith("/")) {
      // Remove ending "/"
      url = defaultUrl.slice(0, -1);
    } else {
      url = defaultUrl;
    }
  }
  const finalRoute = route.startsWith("/") ? route : `/${route}`;
  return `${url}${finalRoute}`;
};

const getApiUrl = getUrl("http://localhost:3001");

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    // TODO:
    // console.log("AUTH ERROR");
    // commonStore.token = "";
    // commonStore.snackbar = {
    //   message: "You were logged out.",
    //   type: "warning"
    // };
    // globalDispatch({ commonStore });
    // TODO: move logout action out
    // commonStore.token = "";
    // globalDispatch({ commonStore });
    // authStore.logout();
  }
  throw err;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  // if (commonStore.token) {
  //   req.set("Authorization", `Bearer ${commonStore.token}`);
  // }
};

const requests = {
  del: url =>
    superagent
      .del(getApiUrl(url))
      .use(tokenPlugin)
      .then(responseBody)
      .catch(handleErrors),
  get: url =>
    superagent
      .get(getApiUrl(url))
      .use(tokenPlugin)
      .then(responseBody)
      .catch(handleErrors),
  put: (url, body) =>
    superagent
      .put(getApiUrl(url), body)
      .use(tokenPlugin)
      .then(responseBody)
      .catch(handleErrors),
  post: (url, body) =>
    superagent
      .post(getApiUrl(url), body)
      .use(tokenPlugin)
      .then(responseBody)
      .catch(handleErrors)
};

export const Auth = {
  login: (data: { username: string; password: string }) =>
    requests.post("/login", data),
  register: (data: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => requests.post("/register", data)
};

export const User = {
  getAll: () => requests.get("/movie"),
  create: (movie: string) => requests.post("/movie", { movie }),
  del: (id: string) => requests.del(`/movie/${id}`)
};
