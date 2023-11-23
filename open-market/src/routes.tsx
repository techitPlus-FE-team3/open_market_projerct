import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Login />}>
			<Route index element={<Index />} />
			<Route path="login" element={<Login />} />
			<Route path="signup" element={<SignUp />} />
		</Route>,
	),
);

export default router;
