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

export type UserPhotoEditRequestResponse = {
  uid: string; // UUID format
  description: string;
  special_note: string;
  request_status: "pending" | "approved" | "rejected"; // assuming enum, adjust if needed
  desire_delivery_date: string; // ISO date string
};
