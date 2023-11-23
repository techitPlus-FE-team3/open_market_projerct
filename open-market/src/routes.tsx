import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Detail from "@/pages/Detail";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Detail />}>
			<Route index element={<Index />} />
			<Route path="login" element={<Login />} />
			<Route path="detail" element={<Detail />} />
		</Route>,
	),
);

export default router;
