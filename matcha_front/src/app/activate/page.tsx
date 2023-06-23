'use client';
import { withLogin } from '@/components/UserProvider';
import { NextPage } from 'next';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { boolean } from 'yup';

const Activate: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    const activate = async () => {
      const emailToken = searchParams.get('token');
      const userToken = localStorage.getItem('token');
      if (!userToken || !emailToken) return;
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          token: emailToken,
        }),
        headers: { Authorization: `Bearer ${userToken}` },
      };
      const uri = 'http://127.0.0.1:8000/activate';
      const res = await fetch(uri, requestOptions);
      setLoading(false);
      if (res.ok) {
        router.push('/profile');
      } else {
        setSuccess(false);
      }
    };
    void activate();
  }, []);

  if (loading) return <p>Validate email</p>;
  else if (!success) return <p>Validation error</p>;
};

export default withLogin(<Activate />);
