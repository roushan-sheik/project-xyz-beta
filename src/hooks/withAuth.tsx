"use client";
import Loading from "@/components/loading/Loading";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (Component: React.FC) => {
  return function ProtectedComponent(props: any) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login");
      }
    }, [user, isLoading]);

    if (isLoading) return <Loading />;

    return <Component {...props} />;
  };
};

export default withAuth;
