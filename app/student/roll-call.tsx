import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';

type ActiveRollCall = {
  id: number;
  paper_number: number;
  paper_name: string;
  start_time: string;
  end_time: string;
  location_lat: number;
  location_lng: number;
  radius_meters: number;
};

export default function RollCallScreen() {
  const { user, token } = useAuth();
  const [activeRollCall, setActiveRollCall] = useState<ActiveRollCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = 'http://192.168.1.39:5000/api';

  const fetchActiveRollCall = async () => {
    if (!token || user?.role !== 'student') return;
    
    try {
      const response = await axios.get(`${API_URL}/roll-calls/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveRollCall(response.data);
    } catch (error: any) {
      console.error('Fetch roll call error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Could not load roll call');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRollCall();
    const interval = setInterval(fetchActiveRollCall, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleMarkAttendance = async () => {
    if (!activeRollCall || !token) return;
    setSubmitting(true);

    try {
      // 🔐 Biometric Authentication
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to mark attendance',
        fallbackLabel: 'Use Passcode',
      });

      if (!auth.success) {
        Alert.alert('Authentication Failed', 'Please try again.');
        return;
      }

      // 📍 Request Location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is required to mark attendance.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 📤 Submit to backend
      const response = await axios.post(
        `${API_URL}/roll-calls/${activeRollCall.id}/attend`,
        {
          student_lat: coords.latitude,
          student_lng: coords.longitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { isWithinRadius, distance, allowedRadius } = response.data;

      if (isWithinRadius) {
        Alert.alert('Success', 'Attendance marked successfully!');
        fetchActiveRollCall(); // refresh
      } else {
        Alert.alert(
          'Outside Range',
          `You are ${distance}m away. Must be within ${allowedRadius}m of classroom.`
        );
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Checking for active roll call...</Text>
      </View>
    );
  }

  if (!activeRollCall) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No Active Roll Call</Text>
        <Text>Check back during class time.</Text>
      </View>
    );
  }

  const now = new Date();
  const endTime = new Date(activeRollCall.end_time);
  const isExpired = now > endTime;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Roll Call</Text>
      <Text style={styles.info}>Paper: {activeRollCall.paper_name}</Text>
      <Text style={styles.info}>
        Ends at: {new Date(activeRollCall.end_time).toLocaleTimeString()}
      </Text>
      
      {isExpired ? (
        <Text style={styles.expired}>This roll call has ended.</Text>
      ) : (
        <Button
          title={submitting ? "Submitting..." : "Mark Attendance"}
          onPress={handleMarkAttendance}
          disabled={submitting}
          color="#007AFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  expired: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});