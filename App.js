import { useEffect } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { RootTabs } from './src/navigation/RootTabs';
import { GlobalPaperBackground } from './src/theme/GlobalPaperBackground';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore race conditions if already hidden.
});

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Ignore hide errors.
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GlobalPaperBackground />
      <RootTabs />
      <StatusBar style="dark" translucent backgroundColor="transparent" />
    </View>
  );
}
