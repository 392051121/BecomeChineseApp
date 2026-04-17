import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import {
  CalendarDays,
  Clock,
  House,
  Map,
  User,
  UtensilsCrossed,
} from 'lucide-react-native';

import { theme } from '../theme/theme';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FoodScreen } from '../screens/FoodScreen';
import { HistoryStack } from './HistoryStack';
import { HomeScreen } from '../screens/HomeScreen';
import { PersonaScreen } from '../screens/PersonaScreen';
import { TravelScreen } from '../screens/TravelScreen';

const Tab = createBottomTabNavigator();

function tabIcon(Icon) {
  return ({ color, size }) => <Icon color={color} size={size} />;
}

export function RootTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenListeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          },
        }}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'rgba(51, 51, 51, 0.55)',
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: 'rgba(51, 51, 51, 0.10)',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home', tabBarIcon: tabIcon(House) }}
        />
        <Tab.Screen
          name="Seasons"
          component={CalendarScreen}
          options={{ tabBarLabel: 'Seasons', tabBarIcon: tabIcon(CalendarDays) }}
        />
        <Tab.Screen
          name="History"
          component={HistoryStack}
          options={{ tabBarLabel: 'History', tabBarIcon: tabIcon(Clock) }}
        />
        <Tab.Screen
          name="Food"
          component={FoodScreen}
          options={{ tabBarLabel: 'Food', tabBarIcon: tabIcon(UtensilsCrossed) }}
        />
        <Tab.Screen
          name="Places"
          component={TravelScreen}
          options={{ tabBarLabel: 'Places', tabBarIcon: tabIcon(Map) }}
        />
        <Tab.Screen
          name="Profile"
          component={PersonaScreen}
          options={{ tabBarLabel: 'Profile', tabBarIcon: tabIcon(User) }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
