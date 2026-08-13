import { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

import { RootTabs } from './src/navigation/RootTabs';
import { GlobalPaperBackground } from './src/theme/GlobalPaperBackground';
import { OnboardingScreen, isOnboardingComplete } from './src/screens/OnboardingScreen';
import { BadgeNotificationProvider } from './src/components/BadgeNotification';
import { ToastProvider } from './src/components/Toast';
import { ThemeProvider } from './src/theme/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OfflineBanner } from './src/components/OfflineBanner';
import { navigationRef } from './src/utils/navigation';
import { configureNotificationHandler, resolveNotificationTarget } from './src/utils/dailyNotification';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore race conditions if already hidden.
});

// Configure foreground notification presentation once at module load.
configureNotificationHandler();

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load bundled CJK serif fonts (subsetted Source Han Serif CN / Noto Serif SC)
  // so Chinese names, titles and share cards render with a proper 宋体 serif on
  // every device — instead of falling back to a generic sans default.
  const [fontsLoaded, fontError] = useFonts({
    'NotoSerifSC-Regular': require('./assets/fonts/NotoSerifSC-Regular.otf'),
    'NotoSerifSC-Bold': require('./assets/fonts/NotoSerifSC-Bold.otf'),
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    async function prepare() {
      try {
        const onboardingComplete = await isOnboardingComplete();
        setShowOnboarding(!onboardingComplete);
      } catch {
        setShowOnboarding(true);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Route notification taps to the solar-term detail screen.
  useEffect(() => {
    const handleResponse = (response) => {
      const target = resolveNotificationTarget(response);
      if (!target) return;
      // Wait until the navigator is mounted, then jump across tabs into the
      // nested stack screen.
      if (navigationRef.isReady()) {
        navigationRef.navigate(target.screen, {
          screen: target.stackScreen,
          params: target.params,
        });
      } else {
        // Cold start: navigation mounts shortly after; retry once.
        const timer = setTimeout(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate(target.screen, {
              screen: target.stackScreen,
              params: target.params,
            });
          }
        }, 500);
      }
    };

    const sub = Notifications.addNotificationResponseReceivedListener(handleResponse);
    // Handle the case where the app was launched by tapping a notification.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => { if (response) handleResponse(response); })
      .catch(() => {});

    return () => sub.remove();
  }, []);

  if (!isReady || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5EE' }}>
        <ActivityIndicator size="large" color="#B33B24" />
      </View>
    );
  }

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
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalPaperBackground />
      <ToastProvider>
        <BadgeNotificationProvider>
          <OfflineBanner />
          <RootTabs />
        </BadgeNotificationProvider>
      </ToastProvider>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
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
