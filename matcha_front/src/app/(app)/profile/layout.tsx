import SecondaryMenu from '@/components/SecondaryMenu';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto my-[50px] max-w-[700px]">
      <SecondaryMenu
        items={[
          { title: 'Profile Information', url: '/profile/information' },
          { title: 'Manage Photos', url: '/profile/photos' },
          { title: 'Email and password', url: '/profile/email_password' },
          { title: 'Location', url: '/profile/location' },
        ]}
      />

      {children}
    </div>
  );
}
