import { NextPage } from 'next';
import Logo from './components/Logo';
import LoginForm from './components/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <div className="mx-auto my-[100px] w-[350px]">
      <Logo />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
