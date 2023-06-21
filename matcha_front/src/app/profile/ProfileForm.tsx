'use client';
import { FC, useContext } from 'react';
import { User } from '@/app/interfaces';
import { UserContext } from '@/app/test';

interface ProfileFormProps {
  user: User;
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1>{user.username}</h1>
      <h1>{user.first_name}</h1>
    </div>
  );
};

export default ProfileForm;
