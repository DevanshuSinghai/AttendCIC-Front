import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import { useRouter } from 'expo-router';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.student_name || '—'}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || '—'}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Roll Number</Text>
        <Text style={styles.value}>{user?.roll_number || '—'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  card: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  logoutButton: { backgroundColor: '#fff1f1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: '#ffd2d2' },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#d32f2f' },
});