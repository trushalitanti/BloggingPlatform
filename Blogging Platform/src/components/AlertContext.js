
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info') => {
    setAlerts(prevAlerts => [...prevAlerts, { message, type }]);
    sendAlertToSubscribers(message, type); // Send alert to subscribed users
  };

  const sendAlertToSubscribers = (message, type) => {
    // Fetch subscribers from the backend
    fetch('/api/getSubscribers?topic=tech')  // Replace 'tech' with actual topic
      .then(response => response.json())
      .then(subscribers => {
        subscribers.forEach(subscriber => {
          // Send alert to each subscriber (e.g., through email, push notification)
          console.log(`Alert sent to subscriber: ${subscriber} - Message: ${message}`);
        });
      });
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
