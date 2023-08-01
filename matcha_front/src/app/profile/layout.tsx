import { getCurrentUser } from '@/api/auth';
import Header from '@/components/header/Header';
import SecondaryMenu from '@/components/SecondaryMenu';
import EmailValidationAlert from './components/EmailValidationAlert';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <>
      <Header user={user} />

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
