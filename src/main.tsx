import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { Provider } from "react-redux";
import { persistedStore, store } from "./store.ts";
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Auth0Provider
        domain="dev-dvg5inonen6831r2.au.auth0.com"
        clientId="NhibxIGiBju1pcpR6Ul8gcaKL0M8JOFR"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore} >
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <App />
                <Toaster />
              </ThemeProvider>
            </PersistGate>
          </Provider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
