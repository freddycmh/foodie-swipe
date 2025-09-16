import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';
import { LikedProvider } from './context/LikedContext';
import { FilterProvider } from './context/FilterContext';

export default function App() {
  return (
    <AuthProvider>
      <LikedProvider>
        <FilterProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </FilterProvider>
      </LikedProvider>
    </AuthProvider>
  );
}