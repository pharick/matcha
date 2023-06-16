export interface User {
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserResponse {
  token: string;
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}
