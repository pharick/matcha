'use client';
import { FC } from 'react';
import { User } from '@/app/interfaces';

interface ProfileFormProps {
  user: User;
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  return (
    <div className="bg-black w-[50]">
      <h1>{user.username}</h1>
      <h1>{user.first_name}</h1>
    </div>
  );
};

export default ProfileForm;
