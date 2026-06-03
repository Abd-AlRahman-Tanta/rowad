import { Dispatch, SetStateAction, useEffect } from 'react';

interface SuccessNotificationProps {
  message: string,
  setMessage: Dispatch<SetStateAction<string | null>>
  duration?: number;
}

const SuccessNotification = ({
  message,
  setMessage,
  duration = 3000
}: SuccessNotificationProps) => {


  useEffect(() => {
    const timeout = setTimeout(() => setMessage(null), duration)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className="fixed inset-0 flex items-end justify-center p-4 z-50 pointer-events-none">
      <div
        className={`max-w-md w-full bg-primary-500 backdrop-blur-md rounded-xl py-4 px-6 shadow-xl text-white font-medium text-center transition-all duration-300 ease-out `}
        role="alert"
      >
        {message}
      </div>
    </div>
  );
};

export default SuccessNotification;