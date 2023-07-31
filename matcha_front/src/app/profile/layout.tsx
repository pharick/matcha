import { getCurrentUser } from '@/api/auth';
import Header from '@/components/Header';
import SecondaryMenu from '@/components/SecondaryMenu';
import EmailValidationAlert from './components/EmailValidationAlert';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Header />

      <div className="mx-auto my-[50px] max-w-[700px]">
        {!user?.active && <EmailValidationAlert />}

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
