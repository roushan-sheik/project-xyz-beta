import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as necessary
}

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("ユーザーデータの取得に失敗しました");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false,
  });
};
