type User = {
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
};

type CurrentUser = User & { active: boolean };

type LoginResponse = {
  token: string;
  user: User;
};

type SignUpData = {
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  password: string;
};

type Photo = {
  id: number;
  user_id: number;
  index: number;
  url: string;
};

type UserPhotos = {
  list: Photo[];
};

type Position = {
  longitude: number;
  latitude: number;
};
