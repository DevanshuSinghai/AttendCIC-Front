import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerTitle: 'Teacher Dashboard',
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hide other screens from tab bar */}
      <Tabs.Screen
        name="index"
        options={{ href: null }} 
      />
      <Tabs.Screen
        name="roll-call"
        options={{ href: null }} 
      />
      {/* <Tabs.Screen
        name="roll-call"
        options={{ href: null }} 
      />
      <Tabs.Screen
        name="paper-details/[id]"
        options={{ href: null }}
      /> */}
    </Tabs>
  );
}