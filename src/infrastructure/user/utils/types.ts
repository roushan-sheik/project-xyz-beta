export type LoginResponse = {
  user: {
    email: string;
    kind: "UNDEFINED" | string;
  };
  refresh: string;
  access: string;
};

export type RegisterResponse = {
  detail: string;
};

export type AuthResponse = LoginResponse | RegisterResponse;
