// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function StudentTabs() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#1976D2',
//         tabBarInactiveTintColor: '#777',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopWidth: 1,
//           borderTopColor: '#eee',
//         },
//         headerStyle: { backgroundColor: '#fff' },
//         headerShadowVisible: false,
//       }}
//     >
//       <Tabs.Screen
//         name="dashboard"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//           headerTitle: 'Dashboard',
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { Redirect } from 'expo-router';

// This makes /student a valid route
// But immediately redirects to dashboard (which is a tab)
export default function TeacherIndex() {
  console.log("bchjfh")
  return <Redirect href="/teacher/dashboard" />;
}