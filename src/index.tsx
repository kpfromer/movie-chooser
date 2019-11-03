import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, ApolloLink } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import CommonStore from './store/CommonStore';

const appCache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql'
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  operation.setContext(({ headers = {} }) => {
    if (token !== null) {
      return {
        headers: {
          ...headers,
          authorization: token
        }
      };
    }
    return { headers };
  });
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }): void => {
      // TODO: better method of catching errors
      if (
        message ===
        'Context creation failed: Your session expired. Sign in again.'
      ) {
        // every 401/unauthorized error will be caught here and update the global local state
        CommonStore.logout();
        CommonStore.notify({
          type: 'info',
          message: 'Logged out. Please sign in again.'
        });
      }
    });
  }
});

export const client = new ApolloClient({
  cache: appCache,
  link: ApolloLink.from([authMiddleware, errorLink, httpLink])
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
