import { NextPage } from 'next';
import Logo from './Logo';
import LoginForm from './LoginForm';

const LoginPage: NextPage = () => {
  return (
    <div className="mx-auto my-[100px] w-[350px]">
      <Logo />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
