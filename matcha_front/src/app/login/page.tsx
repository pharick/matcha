import { NextPage } from 'next';
import Logo from './components/Logo';
import LoginForm from './components/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Logo />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
