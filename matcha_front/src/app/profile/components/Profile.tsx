'use client';

import { FC, useState } from 'react';
import { useContext } from 'react';

import Alert from '@/components/Alert';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';
import Tabs from './Tabs';
import ProfileForm from './ProfileForm';
import PhotoUpload from './PhotoUpload';
import { UserContext } from '@/components/UserProvider';

const EmailValidationAlert: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const resendEmail = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    };
    const uri = '/api/send_activation_email';
    await fetch(uri, requestOptions);
    setIsLoading(false);
  };

  return (
    <Alert type="warning" className="mb-3 flex justify-center">
      <p>Your email is not validated.</p>
      <button
        onClick={() => void resendEmail()}
        className="ml-[10px] flex w-fit items-center underline hover:opacity-80"
        disabled={isLoading}
      >
        Resend email
        {isLoading && (
          <div className="ml-1 h-[15px] w-[15px] animate-spin rounded-full border-2 border-neutral border-r-brown"></div>
        )}
      </button>
    </Alert>
  );
};

const Profile: FC = () => {
  const userContext = useContext(UserContext);

  return (
    <div className="mx-auto my-[50px] max-w-[700px]">
      {userContext.user && !userContext.user.active && <EmailValidationAlert />}

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

          <div>
            <ChangePasswordForm />
            <ChangeEmailForm user={userContext.user} />
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
