import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { RecoilRoot } from "recoil";
import LoadingSpinner from "./components/LoadingSpinner";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RecoilRoot>
			<React.Suspense
				fallback={<LoadingSpinner width="100vw" height="100vh" />}
			>
				<Toaster />
				<App />
			</React.Suspense>
		</RecoilRoot>
	</React.StrictMode>,
);
