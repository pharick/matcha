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

export interface CurrentUser extends User {
  active: boolean;
}

export interface Photo {
  id: number;
  user_id: number;
  url: string;
}
