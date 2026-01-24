import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryProvider } from "./providers/QueryProvider";

import MainteancePage from "./components/MaintenancePage";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "468562803826-3l746fkd419r86kvlaajgogsenm52ubs.apps.googleusercontent.com"; // Fallback to hardcoded if env fails in dev

// Check for query parameter to enable the app
const urlParams = new URLSearchParams(window.location.search);
const enableApp = urlParams.get("enable") === "true";

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </QueryProvider>
  </React.StrictMode>,
);
