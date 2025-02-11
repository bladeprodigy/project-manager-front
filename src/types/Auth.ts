export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterFormProps {
  onToggleToLoginAction: () => void;
}