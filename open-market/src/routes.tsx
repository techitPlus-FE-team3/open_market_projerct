import Index from "@/pages/Index";
import Login from "@/pages/Login";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Index />}>
			<Route index element={<Index />} />
			<Route path="login" element={<Login />} />
		</Route>,
	),
);

export default router;
