import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import SwipeScreen from '../screens/SwipeScreen';
import FilterScreen from '../screens/FilterScreen';

const Stack = createStackNavigator();

const SwipeScreenStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwipeMain"
        component={SwipeScreen}
        options={({ navigation }) => ({
          title: 'Swipe',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Filter')}
              style={{ marginRight: 20 }}
            >
              <Ionicons name="options" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ title: 'Filter Options' }}
      />
    </Stack.Navigator>
  );
};

export default SwipeScreenStack;