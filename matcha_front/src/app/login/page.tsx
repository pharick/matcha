import Image from 'next/image';
import { NextPage } from 'next';

import Matcha from '@/images/Matcha.png';
import Cup from '@/images/cup.png';
import LoginForm from './LoginForm';
import leavesImage from '@/images/leaves.png';
import LeafTop from '@/components/LeafTop';

const LoginPage: NextPage = () => {
  return (
    <>
      {/* <LeafTop /> */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          className="mx-auto"
          src={Cup}
          width={250}
          height={250}
          alt="cup"
        />
        <Image
          className="absolute left-[20px] top-[80px] mx-auto"
          src={Matcha}
          width={350}
          height={200}
          alt="logo"
        />
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
