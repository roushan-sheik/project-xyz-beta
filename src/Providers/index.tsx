import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "./QueryProviders";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </>
  );
};

export default Providers;
