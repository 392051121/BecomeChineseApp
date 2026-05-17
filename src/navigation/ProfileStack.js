import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PersonaScreen } from '../screens/PersonaScreen';
import { CollectionScreen } from '../screens/CollectionScreen';
import { StampCollectionScreen } from '../screens/StampCollectionScreen';

const Stack = createStackNavigator();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={PersonaScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="StampCollection" component={StampCollectionScreen} />
    </Stack.Navigator>
  );
}