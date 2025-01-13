interface NotificationOptions {
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const showNotification = (message: string, options: NotificationOptions = {}) => {
  const event = new CustomEvent('show-notification', {
    detail: {
      message,
      title: options.title || '提示',
      type: options.type || 'info',
      duration: options.duration || 3000
    }
  });
  window.dispatchEvent(event);
}; 