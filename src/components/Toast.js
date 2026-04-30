import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { X, Wifi, WifiOff, AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const ToastContext = createContext(null);

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  offline: WifiOff,
  online: Wifi,
};

const toastColors = {
  success: theme.colors.success,
  error: theme.colors.error,
  warning: '#E2B05E',
  info: theme.colors.primary,
  offline: theme.colors.error,
  online: theme.colors.success,
};

function ToastItem({ toast, onDismiss }) {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const Icon = toastIcons[toast.type] || Info;
  const color = toastColors[toast.type] || theme.colors.primary;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
    ]).start();

    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: theme.motion.durationFast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  }

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: isDark ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(51, 51, 51, 0.08)',
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        {toast.title && (
          <Text style={[styles.title, { color: colors.text }]}>{toast.title}</Text>
        )}
        <Text style={[styles.message, { color: colors.mutedText }]}>{toast.message}</Text>
      </View>
      {toast.action ? (
        <Pressable
          style={[styles.actionBtn, { backgroundColor: `${color}18` }]}
          onPress={() => {
            toast.action.onPress?.();
            handleDismiss();
          }}
        >
          <Text style={[styles.actionText, { color }]}>{toast.action.label}</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.closeBtn} onPress={handleDismiss}>
          <X size={16} color={colors.mutedText} strokeWidth={2} />
        </Pressable>
      )}
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    Haptics.notificationAsync(
      toast.type === 'error' || toast.type === 'offline'
        ? Haptics.NotificationFeedbackType.Error
        : Haptics.NotificationFeedbackType.Success
    ).catch(() => {});
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, title) => show({ type: 'success', message, title }), [show]);
  const error = useCallback((message, title) => show({ type: 'error', message, title }), [show]);
  const warning = useCallback((message, title) => show({ type: 'warning', message, title }), [show]);
  const info = useCallback((message, title) => show({ type: 'info', message, title }), [show]);
  const offline = useCallback((message = 'You are offline. Some features may be unavailable.') =>
    show({ type: 'offline', message, title: 'No Connection', duration: 0 }), [show]);
  const online = useCallback((message = 'Back online!') =>
    show({ type: 'online', message, title: 'Connected', duration: 3000 }), [show]);

  return (
    <ToastContext.Provider value={{ show, dismiss, success, error, warning, info, offline, online }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 12,
    gap: 10,
    ...theme.shadows.medium,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radii.sm,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 8,
  },
});
