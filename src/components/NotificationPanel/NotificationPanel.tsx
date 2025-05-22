import { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';
import './NotificationPanel.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Interview Scheduled',
      message: 'Your interview with Google has been scheduled for tomorrow at 2 PM.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Event Reminder',
      message: 'Amazon Tech Talk starts in 30 minutes.',
      time: '30 minutes ago',
      read: false
    },
    {
      id: 3,
      title: 'Profile Update',
      message: 'Your profile has been successfully updated.',
      time: '1 day ago',
      read: true
    }
  ]);

  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-container">
      <div 
        ref={bellRef}
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell size={26} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div ref={panelRef} className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <span className="notification-count">{unreadCount} unread</span>
          </div>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="notification-action-btn"
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="notification-action-btn"
                      title="Delete notification"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 