import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import useGlobalHook from "./helper/useGlobalHook";
import * as serviceWorker from "./serviceWorker";
import { CustomSnackbarWrapperProps } from "./components/Snackbar/Snackbar";

class CommonStore {
  public username: string;
  public token: string;
  public snackbar?: {
    message: string;
    type: CustomSnackbarWrapperProps["variant"];
  };

  constructor() {
    this.username =
      localStorage.getItem("username") === null
        ? ""
        : localStorage.getItem("username")!;
    this.token =
      localStorage.getItem("token") === null
        ? ""
        : localStorage.getItem("token")!;
  }
}

export const commonStore = new CommonStore();

// don't get state in actions!!
export const [useGlobalState, globalDispatch] = useGlobalHook(
  {
    commonStore
  },
  {
    setUsername: (state, action: string) => {
      state.commonStore.username = action;
      localStorage.setItem("username", action);
      return { commonStore: state.commonStore };
    },
    setToken: (state, action: string) => {
      state.commonStore.token = action;
      localStorage.setItem("token", action);
      return { commonStore: state.commonStore };
    },
    setSnackbar: (
      state,
      action?: {
        message: string;
        type: CustomSnackbarWrapperProps["variant"];
      }
    ) => {
      state.commonStore.snackbar = action;
      return {
        commonStore: state.commonStore
      };
    }
  }
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
