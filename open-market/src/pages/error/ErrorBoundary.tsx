import Error404 from "@/pages/error/Error404";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error) && error.status === 404) {
		return <Error404 />;
	}
	throw error;
}

export default ErrorBoundary;
