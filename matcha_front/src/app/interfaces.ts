export interface User {
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RegistrationResponse {
  token: string;
  user: User;
}
