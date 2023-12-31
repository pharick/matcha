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
  distance: number;
  online: boolean;
  last_online: string;
  blocked: boolean;
  me_blocked: boolean;
  reported: boolean;
};

type CurrentUser = User & {
  active: boolean;
  avatar: string;
  last_position: Position;
  custom_position: Position;
};

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
  latitude: number;
  longitude: number;
};

type MNotification = {
  id: number;
  type: 'visit' | 'like' | 'dislike' | 'match' | 'message';
  username: string;
  create_time: string;
  viewed: boolean;
};

interface SearchParams {
  ageFrom: number;
  ageTo: number;
  minFame: number;
  maxDistance: number;
  tags: string[];
  sortField: string;
  sortType: string;
}

type ChatMessage = {
  id: number;
  from_user_id: number;
  to_user_id: number;
  text: string;
  created_at: string;
};

type NewChatMessage = {
  text: string;
};
