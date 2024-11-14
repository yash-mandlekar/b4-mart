import React, { createContext, useState } from "react";

// Create a context for notification
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const toggleNotification = () => {
    setIsNotificationVisible((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{ isNotificationVisible, toggleNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
