import { useState } from 'react';
import { onMessage } from 'firebase/messaging';

import { BsAlarm } from '@react-icons/all-files/bs/BsAlarm';

import { messaging } from '@/utils/fcm';

const NotificationAlarm = () => {
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  onMessage(messaging, payload => {
    if (payload.notification) {
      setNotificationMessage(payload.notification?.body as string);
      setNotification(true);
      setTimeout(() => setNotification(false), 15000);
    }
  });

  const onclick = () => {
    setNotification(false);
  };

  return (
    notification && (
      <div className="p-0 pt-4 z-[60] toast toast-center toast-middle">
        <div className="bg-white shadow-xl border-2 w-full min-w-[320px] card border-[#dddddd]">
          <div className="p-6 card-body">
            <div className="flex items-center">
              <BsAlarm size={25} className="text-error" />
              <h1 className="ml-3 text-2xl text-black card-title">알림</h1>
            </div>
            <span className="text-lg text-black">{notificationMessage}</span>
            <div className="justify-end card-actions">
              <button
                type="button"
                className="min-h-0 py-2 btn btn-neutral"
                onClick={onclick}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationAlarm;
