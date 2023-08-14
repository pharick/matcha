interface HTMLPropsWithRefCallback<T> extends HTMLProps<T> {
  ref: RefCallback<T>;
}

type MenuItem = {
  title: string;
  url: string;
};

type Gender = 'male' | 'female' | 'other';

type User = {
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  gender: Gender | '';
  gender_preferences: Gender[];
  biography: string;
  tags: string[];
  me: boolean;
  liked: boolean;
  match: boolean;
  avatar: string;
  rating: number;
};

type CurrentUser = User & { active: boolean; avatar: string };

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

type ProfileDataBase = {
  first_name: string;
  last_name: string;
  gender_preferences: Gender[];
  biography: string;
  tags: string[];
};

type ProfileData = ProfileDataBase & { gender: Gender };

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

type MNotification = {
  id: number;
  type: 'visit' | 'like' | 'dislike';
  username: string;
  create_time: string;
  viewed: boolean;
};
