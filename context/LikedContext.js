// context/LikedContext.js
import React, { createContext, useContext, useState } from 'react';

const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState([]);

  return (
    <LikedContext.Provider value={{ liked, setLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

export const useLiked = () => useContext(LikedContext);
export { LikedContext };