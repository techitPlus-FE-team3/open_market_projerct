import { Outlet, useLocation } from "react-router-dom";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

function RootLayout() {
	const location = useLocation();
	const auth = ["/signin", "/signup"];

	return (
		<>
			{!auth.includes(location.pathname) && <Header />}
			<main>
				<Outlet />
			</main>
			{!auth.includes(location.pathname) && <Footer />}
		</>
	);
}

export default RootLayout;
