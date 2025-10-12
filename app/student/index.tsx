import { Redirect } from 'expo-router';

// This makes /student a valid route
// But immediately redirects to dashboard (which is a tab)
export default function StudentIndex() {
  return <Redirect href="/student/dashboard" />;
}