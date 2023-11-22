import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { renderToString } from "react-dom/server";

const helmetContext: { helmet: HelmetServerState } = {
    helmet: {} as HelmetServerState,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <HelmetProvider context={helmetContext}>
        <React.StrictMode>
            <Toaster />
            <App />
        </React.StrictMode>
    </HelmetProvider>,
);

const html = renderToString(<App />);

const { helmet } = helmetContext;
