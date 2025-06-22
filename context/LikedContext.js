import React, { createContext, useState } from 'react';

export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState([]);

  return (
    <LikedContext.Provider value={{ liked, setLiked }}>
      {children}
    </LikedContext.Provider>
  );
};