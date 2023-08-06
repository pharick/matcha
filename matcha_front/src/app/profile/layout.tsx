import { getCurrentUser } from '@/api/auth';
import Header from '@/components/header/Header';
import SecondaryMenu from '@/components/SecondaryMenu';
import EmailValidationAlert from './components/EmailValidationAlert';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserPromise = getCurrentUser();

  return (
    <>
      <Header currentUserPromise={currentUserPromise} />

      <div className="mx-auto my-[50px] max-w-[700px]">
        <EmailValidationAlert />

        <SecondaryMenu
          items={[
            { title: 'Profile Information', url: '/profile/information' },
            { title: 'Manage Photos', url: '/profile/photos' },
            { title: 'Email and password', url: '/profile/email_password' },
          ]}
        />

        {children}
      </div>
    </>
  );
}
