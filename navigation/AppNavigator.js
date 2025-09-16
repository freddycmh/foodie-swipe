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
      borderRadius: 12, // 25% smaller
      width: 38, // 25% smaller
      height: 24, // 25% smaller
      marginBottom: 1, // 25% smaller
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
          fontSize: 8, // 25% smaller (10 * 0.75 ≈ 8)
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 1 : 4, // 25% smaller
          marginTop: 1, // 25% smaller
        },
        tabBarItemStyle: {
          paddingVertical: 4, // 25% smaller
          paddingHorizontal: 3, // 25% smaller
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 64 : 57, // 25% smaller
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF',
          borderTopWidth: 0,
          borderRadius: 18, // 25% smaller
          marginHorizontal: 12,
          marginBottom: Platform.OS === 'ios' ? 18 : 8, // 25% smaller
          paddingBottom: Platform.OS === 'ios' ? 17 : 6, // 25% smaller
          paddingTop: 6, // 25% smaller
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3, // 25% smaller
          },
          shadowOpacity: 0.15,
          shadowRadius: 15, // 25% smaller
          elevation: 15, // 25% smaller
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
                borderRadius: 18, // 25% smaller
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
              borderRadius: 18, // 25% smaller
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