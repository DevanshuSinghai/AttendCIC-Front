import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'student') {
        router.replace('/student/dashboard');
      } else if (user.role === 'teacher') {
        router.replace('/teacher/dashboard');
      }
    } else if (!loading && !user) {
      // Not logged in → go to login
      router.replace('/');
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}