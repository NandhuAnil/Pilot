import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'guest' | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<{ role?: string }>(token);
          const role = decoded?.role;
          if (role === 'user' || role === 'admin') {
            setUserRole(role);
          } else {
            setUserRole('guest');
          }
        } else {
          setUserRole('guest');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setUserRole('guest');
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    checkToken();
  }, []);

  if (!isAppReady || userRole === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Use screen names (not paths) as initial route
  let initialRoute = '(auth)';
  if (userRole === 'user') {
    initialRoute = '(tabs)';
  } else if (userRole === 'admin') {
    initialRoute = '(admintabs)/checklistListScreen';
  }

  return (
    <Stack initialRouteName={initialRoute} screenOptions={{ headerShown: false }} />
  );
}
