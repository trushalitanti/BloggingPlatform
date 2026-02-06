// storage.js
import fs from 'fs';

const USERS_FILE_PATH = 'users.json';

export const getUserData = () => {
  try {
    const userData = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error reading user data:', error.message);
    return [];
  }
};

export const setUserData = (userData) => {
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(userData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing user data:', error.message);
  }
};
