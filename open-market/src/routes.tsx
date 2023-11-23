import Index from "@/pages/Index";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import ProductRegistration from "@/pages/ProductRegistration";
import RootLayout from "@/layout/RootLayout";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Index />} />
			<Route path="registration" element={<ProductRegistration />} />
		</Route>,
	),
);

export default router;
