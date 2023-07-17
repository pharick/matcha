'use client';

import { FC } from 'react';
import { useContext } from 'react';

import Alert from '@/components/Alert';
import Tabs from './Tabs';
import ProfileForm from './ProfileForm';
import PhotoUpload from './PhotoUpload';
import { UserContext } from '@/components/UserProvider';

const Profile: FC = () => {
  const userContext = useContext(UserContext);

  const resendEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    };
    const uri = '/api/send_activation_email';
    const res = await fetch(uri, requestOptions);
    console.log(res);
  };

  return (
    <div className="mx-auto my-[50px] max-w-[700px]">
      {userContext.user && !userContext.user.active && (
        <Alert type="warning" className="mb-3">
          Your email is not validated.
          <button
            onClick={() => void resendEmail()}
            className="ml-[10px] underline"
          >
            Resend email
          </button>
        </Alert>
      )}
      {userContext.user && (
        <Tabs
          captions={[
            'Profile Information',
            'Manage Photos',
            'Email and password',
          ]}
        >
          <ProfileForm user={userContext.user} />
          <PhotoUpload user={userContext.user} />
          <div>3</div>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
