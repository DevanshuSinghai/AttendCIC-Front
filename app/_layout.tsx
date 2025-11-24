import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { useEffect } from 'react';

function AuthWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (!loading && user) {
    if (user.role === 'student') {
      router.replace('/student') 
    } else if (user.role === 'teacher') {
      router.replace('/teacher')
    } else if (user.role === 'admin') {
      router.replace('/admin'); 
    }
  }
}, [user, loading, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      
      {/* Remove unused (tabs) */}
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      
      {/* Keep these for direct access (optional) */}
      <Stack.Screen name="student/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="teacher/dashboard" options={{ title:'', headerShown: false }} />
      {/* <Stack.Screen name="(teacher)" options={{ title:'', headerShown: false }} /> */}
      <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}