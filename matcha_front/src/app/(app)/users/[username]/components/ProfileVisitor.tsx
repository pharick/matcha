'use client';

import { visitUserProfile } from '@/api/profile';
import { FC, useEffect } from 'react';

interface ProfileVisitorProps {
  username: string;
}

const ProfileVisitor: FC<ProfileVisitorProps> = ({ username }) => {
  useEffect(() => {
    void visitUserProfile(username);
  }, [username]);

  return <></>;
};

export default ProfileVisitor;
