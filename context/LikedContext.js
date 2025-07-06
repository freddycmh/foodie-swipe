import React, { createContext, useState, useContext } from 'react';

export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState([]);

  const addLiked = (restaurant) => {
    setLiked((prev) => [...prev, restaurant]);
  };

  const clearLiked = () => {
    setLiked([]);
  };

  return (
    <LikedContext.Provider value={{ liked, addLiked, clearLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

// ✅ This is what you use in SwipeScreen
export const useLiked = () => useContext(LikedContext);