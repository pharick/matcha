'use client';
import Image from 'next/image';
import { NextPage } from 'next';
import Header from '@/components/Header';
import ProfileForm from './components/ProfileForm';
import { UserContext, withLogin } from '@/components/UserProvider';
import { useContext } from 'react';
import LeafDown from '@/images/leafe_down.png';
import Alert from '@/components/Alert';

const ProfilePage: NextPage = () => {
  const userContext = useContext(UserContext);
  // const [sended, setSended] = UseState<boolean>(false);

  const resendEmail = async () => {
    console.log('here');
    const token = localStorage.getItem('token');
    if (!token) return;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    };
    const uri = 'http://127.0.0.1:8000/send_activation_email';
    const res = await fetch(uri, requestOptions);
    console.log(res);
    if (res.ok) {
      console.log(res);
    } else return;
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
        {userContext.user ? <ProfileForm user={userContext.user} /> : <></>}
      </div>
    </>
  );
};

export default withLogin(<ProfilePage />);
