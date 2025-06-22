import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // ✅ Make sure this exists
import { LikedProvider } from './context/LikedContext'; // ✅ Important

export default function App() {
  return (
    <LikedProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LikedProvider>
  );
}