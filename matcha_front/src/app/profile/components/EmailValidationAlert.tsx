'use client';

import { FC, useState } from 'react';

import Alert from '@/components/Alert';
import { sendActivationEmail } from '@/api/auth';

const EmailValidationAlert: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resendEmail = async () => {
    setIsLoading(true);
    await sendActivationEmail();
    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <Alert type="success" className="mb-3 flex justify-center">
        Check your email for validation link
      </Alert>
    );
  }

  return (
    <Alert type="warning" className="mb-3 flex justify-center">
      <p>Your email is not validated</p>
      <button
        onClick={() => void resendEmail()}
        className="ml-[10px] flex w-fit items-center underline hover:opacity-80"
        disabled={isLoading}
      >
        Resend email
        {isLoading && (
          <div className="ml-1 h-[15px] w-[15px] animate-spin rounded-full border-2 border-neutral border-r-brown"></div>
        )}
      </button>
    </Alert>
  );
};

export default EmailValidationAlert;
