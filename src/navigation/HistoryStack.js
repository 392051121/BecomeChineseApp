import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HistoryScreen } from '../screens/HistoryScreen';
import { DynastyDetailScreen } from '../screens/DynastyDetailScreen';
import { PersonDetailScreen } from '../screens/PersonDetailScreen';

const Stack = createStackNavigator();

export function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} />
      <Stack.Screen name="DynastyDetail" component={DynastyDetailScreen} />
      <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
    </Stack.Navigator>
  );
}
