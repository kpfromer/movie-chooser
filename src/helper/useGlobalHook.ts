import React from "react";

type SecondArgument<T> = T extends (
  arg1: any,
  arg2: infer U,
  ...args: any[]
) => any
  ? U
  : any;

type Action<S, A> = (state: S, action: A) => Partial<S>;
type ActionWithState<S, A> = (action: A) => S;

type Listener = React.Dispatch<React.SetStateAction<any>>;

interface ActionObject<S, A> {
  [key: string]: Action<S, A>;
}

type ActionObjectWithState<S, A, R extends ActionObject<S, A>> = {
  [K in keyof R]: ActionWithState<S, SecondArgument<R[K]>>;
};

interface Store<S> {
  state: S;
  listeners: Listener[];
  // actions: Action<Store<S>, any>[];
}

const setState = <S>(store: Store<S>) => <S>(newState: Partial<S>) => {
  store.state = { ...store.state, ...newState };
  store.listeners.forEach(listener => {
    listener(store.state);
  });
};

function useCustom<S, R, A extends ActionObjectWithState<S, R, any>>(
  store: Store<S>,
  actions: A
): () => [S, A] {
  // Must be named for react to compile
  return function useGlobal() {
    const newListener = React.useState()[1];
    React.useEffect(() => {
      store.listeners.push(newListener);
      return () => {
        // listeners = filter listener => listener !== newListener;
        const filteredListeners: Listener[] = [];
        for (let i = 0; i < store.listeners.length; i++) {
          if (store.listeners[i] !== newListener) {
            filteredListeners.push(store.listeners[i]);
          }
        }
        store.listeners = filteredListeners;
      };
    });
    return [store.state, actions];
  };
}

function associateActions<S, A>(
  store: Store<S>,
  set: ReturnType<typeof setState>,
  actions: ActionObject<S, A>
): ActionObjectWithState<S, A, any> {
  const associatedActions = {};
  for (const key of Object.keys(actions)) {
    if (typeof actions[key] === "function") {
      // TODO: update for promise
      associatedActions[key] = (action: any) =>
        set<S>(actions[key](store.state, action));
    }
    // TODO: actions for properties
    // if (typeof actions[key] === 'object') {
    //   associatedActions[key] = associateActions(store, set, actions[key]);
    // }
  }
  return associatedActions as ActionObjectWithState<S, A, any>;
}

// const useGlobalHook = <S, A>(initialState: S, actions: ActionObject<S, A>): () => [S, ActionObjectWithState<S, A>] => {
const useGlobalHook = <S, A extends ActionObject<S, any>>(
  initialState: S,
  actions: A
): [
  (() => [S, ActionObjectWithState<S, A, A>]), // useGlobalState
  ((newState: Partial<S>) => void) // dispatch
] => {
  const store: Store<S> = {
    state: initialState,
    listeners: []
  };

  const set = setState<S>(store);
  const associatedActions = associateActions<S, any>(store, set, actions);

  return [useCustom(store, associatedActions), set];
};

export default useGlobalHook;
