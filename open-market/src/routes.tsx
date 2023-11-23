import RootLayout from "@/layout/RootLayout";
import Detail from "@/pages/Detail";
import Index from "@/pages/Index";
import ProductRegistration from "@/pages/ProductRegistration";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import ProductEdit from "./pages/ProductEdit";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			<Route path="signin" element={<SignIn />} />
			<Route path="registration" element={<ProductRegistration />} />
			<Route path="signup" element={<SignUp />} />
			<Route path="edit/:productId" element={<ProductEdit />} />
			<Route path="detail" element={<Detail />} />
		</Route>,
	),
);

export default router;
