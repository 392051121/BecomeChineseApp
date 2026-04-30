import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '../screens/HomeScreen';
import { PathDetailScreen } from '../screens/PathDetailScreen';

const Stack = createStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PathDetail" component={PathDetailScreen} />
    </Stack.Navigator>
  );
}