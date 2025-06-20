"use client";

import { useLogout } from "@/hooks/admin/useLogout";
import React from "react";
import Button, { ButtonProps } from "../ui/Button";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LogoutButtonProps extends Omit<ButtonProps, "onClick"> {}

const LogoutButton: React.FC<LogoutButtonProps> = (props) => {
  const logout = useLogout();

  return (
    <Button onClick={logout} {...props}>
      {props.children ?? "Logout"}
    </Button>
  );
};

export default LogoutButton;
