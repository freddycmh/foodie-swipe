import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { LikedProvider } from './context/LikedContext';
import { FilterProvider } from './context/FilterContext'; // ✅ must be here

export default function App() {
  return (
    <LikedProvider>
      <FilterProvider> {/* ✅ This wraps the app */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FilterProvider>
    </LikedProvider>
  );
}