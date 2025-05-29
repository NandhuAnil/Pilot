import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          router.replace('/(auth)');
          return;
        }

        const decoded = jwtDecode<{ role?: string }>(token);
        const role = decoded?.role;

        if (role === 'admin') {
          router.replace('/(admintabs)');
        } else if (role === 'user') {
          router.replace('/(tabs)');
        } else {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          router.replace('/(auth)');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        router.replace('/(auth)');
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(admintabs)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(components)" />
    </Stack>
  );
}
