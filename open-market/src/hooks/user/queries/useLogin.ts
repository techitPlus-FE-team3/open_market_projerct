import { useQuery } from "@tanstack/react-query";
import { loginUser } from "@/apis/user/auth";

export const useLogin = (email: string, password: string) => {
	return useQuery({
		queryKey: ["login", email, password],
		queryFn: () => loginUser(email, password),
		enabled: !!email && !!password,
	});
};
