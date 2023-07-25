import { CurrentUser } from '@/interfaces';
import { FC } from 'react';

interface UserBiographyProps {
  user: CurrentUser;
}

const UserBiography: FC<UserBiographyProps> = ({ user }) => {
  return <div>{user?.biography}</div>;
};

export default UserBiography;
