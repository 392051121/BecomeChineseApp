import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { GlobalPaperBackground } from '../theme/GlobalPaperBackground';
import { CustomTabBar } from '../components/CustomTabBar';
import { SeasonsStack } from './SeasonsStack';
import { FoodScreen } from '../screens/FoodScreen';
import { HistoryStack } from './HistoryStack';
import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { TravelScreen } from '../screens/TravelScreen';
import { navigationRef } from '../utils/navigation';
import { isDailyReminderEnabled, scheduleDailyTermNotification } from '../utils/dailyNotification';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  const { colors } = useTheme();

  // Daily "Today's Solar Term" reminder: schedule once the main app is mounted
  // (i.e. after onboarding), unless the user has explicitly disabled it.
  useEffect(() => {
    isDailyReminderEnabled()
      .then((enabled) => (enabled ? scheduleDailyTermNotification() : Promise.resolve(false)))
      .catch(() => {});
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <GlobalPaperBackground />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Nested stack tabs: leave → pop to list root so next entry isn't a stale detail. */}
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen
          name="Seasons"
          component={SeasonsStack}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen
          name="History"
          component={HistoryStack}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen name="Food" component={FoodScreen} />
        <Tab.Screen name="Places" component={TravelScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{ popToTopOnBlur: true }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
