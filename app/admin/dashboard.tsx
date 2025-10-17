import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity,} from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.1.9:5000/api';

export default function AdminDashboard() {
  const {logout} = useAuth();
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
              router.replace('/'); // Go to login screen
            }
          }
        ]
      );
    };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Admin Dashboard</Text>
      <TouchableOpacity
          style={[styles.card, { backgroundColor: '#fff3e0' }]}
          onPress={handleLogout}
        >
          <View style={styles.cardIcon}>
            <Text>🚪</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Logout</Text>
            <Text style={styles.cardSubtitle}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});