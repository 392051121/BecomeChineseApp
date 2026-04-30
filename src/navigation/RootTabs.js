import React from 'react';
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

const Tab = createBottomTabNavigator();

export function RootTabs() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer>
      <GlobalPaperBackground />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Seasons" component={SeasonsStack} />
        <Tab.Screen name="History" component={HistoryStack} />
        <Tab.Screen name="Food" component={FoodScreen} />
        <Tab.Screen name="Places" component={TravelScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
