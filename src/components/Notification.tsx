import React, { useEffect } from 'react';
import { message } from 'antd';
import 'antd/dist/reset.css';

interface NotificationState {
  message: string;
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleNotification = (event: CustomEvent<NotificationState>) => {
      const { type, message: content, duration } = event.detail;
      
      switch (type) {
        case 'success':
          message.success(content, duration / 1000);
          break;
        case 'error':
          message.error(content, duration / 1000);
          break;
        case 'warning':
          message.warning(content, duration / 1000);
          break;
        default:
          message.info(content, duration / 1000);
      }
    };

    window.addEventListener('show-notification' as any, handleNotification);
    return () => {
      window.removeEventListener('show-notification' as any, handleNotification);
    };
  }, []);

  message.config({
    top: 60,
    duration: 3,
    maxCount: 3,
  });

  return <>{children}</>;
}; 