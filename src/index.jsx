import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import RecoilOutside from "recoil-outside"
import { RecoilRoot } from "recoil";
import * as serviceWorker from './serviceWorker';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import './components/style/style.css';  //For React Sortable Tree custom style 
import configParam from './config'
import './index.css'
// import  '@geist-ui/core/font';




const httpLink = createHttpLink({
  uri: configParam.GRAPHQL_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('neoToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token.replace(/['"]+/g, '')}` : ""
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ addTypename: false })
});

const isIE = /*@cc_on!@*/false || !!document.documentMode;
if (import.meta.env.VITE_STAGE === 'prod') {
  Sentry.init({
    dsn: "https://863ec75eb01fbcca9d493adbc1993507@o1166813.ingest.sentry.io/4506221982908416",
    integrations: [new BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
    environment: "production",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<>
  {isIE ? <></> :
    <RecoilRoot>
      <RecoilOutside/>
      <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
      </ApolloProvider>
    </RecoilRoot>}</>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
