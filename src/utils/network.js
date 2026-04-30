import { useEffect, useState, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useToast } from '../components/Toast';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const wasOffline = useRef(false);
  const { offline, online } = useToast();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const currentlyConnected = state.isConnected && state.isInternetReachable !== false;

      // Show toast when going offline
      if (!currentlyConnected && wasOffline.current === false) {
        offline();
      }

      // Show toast when coming back online
      if (currentlyConnected && wasOffline.current === true) {
        online();
      }

      wasOffline.current = !currentlyConnected;
      setIsConnected(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
      wasOffline.current = !connected;
    }).catch(() => {});

    return () => unsubscribe();
  }, [offline, online]);

  const isOffline = !isConnected || !isInternetReachable;

  return {
    isConnected,
    isInternetReachable,
    isOffline,
  };
}

export function useOfflineHandler() {
  const { isOffline } = useNetworkStatus();
  const toast = useToast();

  const withOfflineCheck = useCallback(
    async (asyncFn, fallbackMessage = 'This action requires an internet connection') => {
      if (isOffline) {
        toast.warning(fallbackMessage, 'Offline');
        return null;
      }
      try {
        return await asyncFn();
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
        throw error;
      }
    },
    [isOffline, toast]
  );

  return {
    isOffline,
    withOfflineCheck,
  };
}
