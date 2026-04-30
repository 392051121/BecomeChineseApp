import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CalendarScreen } from '../screens/CalendarScreen';
import { WrongAnswerReviewScreen } from '../screens/WrongAnswerReviewScreen';

const Stack = createStackNavigator();

export function SeasonsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SeasonsMain" component={CalendarScreen} />
      <Stack.Screen name="WrongAnswerReview" component={WrongAnswerReviewScreen} />
    </Stack.Navigator>
  );
}