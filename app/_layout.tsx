import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setUserRole(null);
          return;
        }

        const response = await fetch('http://192.168.10.102:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role);
          setIsLoggedIn(true);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
      } catch (e) {
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync(); // 👈 Hide splash after loading is done
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return null; // Don't render routes while loading

  return (
    <Stack>
      {!isLoggedIn ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : userRole === 'admin' ? (
        <Stack.Screen name="(admintabs)" options={{ headerShown: false }} />
      ) : userRole === 'user' ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="(components)" options={{ headerShown: false }} />
    </Stack>
  );
}
