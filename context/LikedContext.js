import React, { createContext, useState, useContext } from 'react';

export const LikedContext = createContext();

export const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState([]);

  const addLiked = (restaurant) => {
    setLiked((prev) => [...prev, restaurant]);
  };

  const removeLiked = (restaurantId) => {
    setLiked((prev) => prev.filter(restaurant =>
      (restaurant.place_id || restaurant.id) !== restaurantId
    ));
  };

  const clearLiked = () => {
    setLiked([]);
  };

  return (
    <LikedContext.Provider value={{ liked, addLiked, removeLiked, clearLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

// ✅ This is what you use in SwipeScreen
export const useLiked = () => useContext(LikedContext);