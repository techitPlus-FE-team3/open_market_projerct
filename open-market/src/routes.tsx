import Index from "@/pages/Index";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Index />}>
			<Route index element={<Index />} />
		</Route>,
	),
);

export default router;
