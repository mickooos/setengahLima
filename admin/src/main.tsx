import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.ts";
import App from "./App.tsx";
import axios from "axios";
import "./index.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
