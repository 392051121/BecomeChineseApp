import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HistoryScreen } from '../screens/HistoryScreen';
import { DynastyDetailScreen } from '../screens/DynastyDetailScreen';

const Stack = createNativeStackNavigator();

export function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} />
      <Stack.Screen name="DynastyDetail" component={DynastyDetailScreen} />
    </Stack.Navigator>
  );
}
