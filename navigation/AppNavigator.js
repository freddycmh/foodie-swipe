import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import HomeScreen from '../screens/HomeScreen';
import SwipeScreenStack from './SwipeScreenStack';
import ResultScreen from '../screens/ResultScreen';

const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ focused, iconName, color, size }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? 'rgba(255, 90, 95, 0.15)' : 'transparent',
      borderRadius: 16,
      width: 50,
      height: 32,
      marginBottom: 2,
    }}>
      <Ionicons
        name={iconName}
        size={focused ? size + 2 : size - 1}
        color={focused ? '#FF5A5F' : color}
        style={{
          textShadowColor: focused ? 'rgba(255, 90, 95, 0.3)' : 'transparent',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        }}
      />
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Swipe':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'bookmark' : 'bookmark-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <CustomTabIcon
              focused={focused}
              iconName={iconName}
              color={color}
              size={size}
            />
          );
        },
        tabBarActiveTintColor: '#FF5A5F',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 2 : 6,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          paddingHorizontal: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 85 : 76,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF',
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 12,
          marginBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingBottom: Platform.OS === 'ios' ? 22 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                overflow: 'hidden',
              }}
            />
          ) : (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
            }} />
          )
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen
        name="Swipe"
        component={SwipeScreenStack}
        options={{
          tabBarLabel: 'Swipe',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={ResultScreen}
        options={{
          tabBarLabel: 'Saved',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;