export interface User {
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | '';
  gender_preferences: ('male' | 'female' | 'other')[];
  biography: string;
  tags: string[];
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
  index: number;
  url: string;
}

export interface UserPhotos {
  list: Photo[];
}

export interface Position {
  longitude: number;
  latitude: number;
}

export interface GeolocationDBResponse {
  longitude: number;
  latitude: number;
}
