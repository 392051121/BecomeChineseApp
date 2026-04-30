import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootTabs } from './src/navigation/RootTabs';
import { GlobalPaperBackground } from './src/theme/GlobalPaperBackground';
import { OnboardingScreen, isOnboardingComplete } from './src/screens/OnboardingScreen';
import { BadgeNotificationProvider } from './src/components/BadgeNotification';
import { ToastProvider } from './src/components/Toast';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore race conditions if already hidden.
});

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        const onboardingComplete = await isOnboardingComplete();
        setShowOnboarding(!onboardingComplete);
      } catch {
        setShowOnboarding(true);
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5EE' }}>
        <ActivityIndicator size="large" color="#B33B24" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <View style={{ flex: 1 }}>
        <GlobalPaperBackground />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor="transparent" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalPaperBackground />
      <ToastProvider>
        <BadgeNotificationProvider>
          <RootTabs />
        </BadgeNotificationProvider>
      </ToastProvider>
      <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor="transparent" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
