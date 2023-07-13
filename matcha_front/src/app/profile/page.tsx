'use client';
import Image from 'next/image';
import { NextPage } from 'next';
import Header from '@/components/Header';
import ProfileForm from './components/ProfileForm';
import { UserContext, withLogin } from '@/components/UserProvider';
import { useContext } from 'react';
import LeafDown from '@/images/leafe_down.png';
import Alert from '@/components/Alert';
import Tabs from './components/Tabs';
import PhotoUpload from './components/PhotoUpload';

const ProfilePage: NextPage = () => {
  const userContext = useContext(UserContext);
  // const [sended, setSended] = UseState<boolean>(false);

  const resendEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    };
    const uri = '/api/send_activation_email';
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      console.log(res);
    }
  };

  return (
    <>
      <Header />
      <Image
        className="absolute bottom-0 left-0 -z-50 object-contain"
        src={LeafDown}
        alt="leaf"
        width={1500}
      />

      <div className="mx-auto mt-[50px] max-w-[700px]">
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
              'Upload Photo',
              'Change e-mail and password',
            ]}
          >
            <ProfileForm user={userContext.user} />
            <PhotoUpload user={userContext.user} />
            <div>3</div>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default withLogin(ProfilePage);
