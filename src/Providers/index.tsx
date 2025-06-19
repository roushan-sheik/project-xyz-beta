import React from "react";
import UserProvider from "@/context/AuthContext";
import { QueryProvider } from "./QueryProviders";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <UserProvider>
        <QueryProvider>{children}</QueryProvider>
      </UserProvider>
    </>
  );
};

export default Providers;
