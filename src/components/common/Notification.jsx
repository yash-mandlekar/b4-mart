import React, { useContext } from "react";
import { NotificationContext } from "../common/NotificationContext";
import "../../Css/Notification.css"; // Add your styling here

const NotificationPopup = () => {
  const { isNotificationVisible } = useContext(NotificationContext);

  if (!isNotificationVisible) {
    return null;
  }

  return (
    <div className="notification-popup">
      <div className="notification-content">
        <p>You have a new notification!</p>
      </div>
    </div>
  );
};

export default NotificationPopup;
