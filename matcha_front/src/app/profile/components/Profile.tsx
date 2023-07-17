'use client';

import { FC, useState } from 'react';
import { useContext } from 'react';

import Alert from '@/components/Alert';
import Modal from '@/components/Modal';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';
import Tabs from './Tabs';
import ProfileForm from './ProfileForm';
import PhotoUpload from './PhotoUpload';
import { UserContext } from '@/components/UserProvider';

const Profile: FC = () => {
  const userContext = useContext(UserContext);

  const [changePasswordFormOpen, setChangePasswordFormOpen] =
    useState<boolean>(false);
  const [changeEmailFormOpen, setChangeEmailFormOpen] =
    useState<boolean>(false);

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
          <ul>
            <li>
              <ChangePasswordForm />
            </li>
            <li>
              <ChangeEmailForm />
            </li>
          </ul>
          {/* <ul>
            <li>
              <button
                type="button"
                onClick={() => setChangePasswordFormOpen(true)}
                className="font-bold underline"
              >
                Change password
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setChangeEmailFormOpen(true)}
                className="font-bold underline"
              >
                Change Email
              </button>
            </li>
          </ul> */}
        </Tabs>
      )}
{/* 
      <Modal
        isOpen={changePasswordFormOpen}
        handleClose={() => setChangePasswordFormOpen(false)}
      >
        <ChangePasswordForm
          handleClose={() => setChangePasswordFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={changeEmailFormOpen}
        handleClose={() => setChangeEmailFormOpen(false)}
      >
        <ChangeEmailForm handleClose={() => setChangeEmailFormOpen(false)} />
      </Modal> */}
    </div>
  );
};

export default Profile;
