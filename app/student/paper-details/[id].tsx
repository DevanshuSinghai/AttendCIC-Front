import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthProvider';
import axios from 'axios';

const API_URL = 'http://192.168.1.54:5000/api';

type AttendanceRecord = {
  class_date: string;
  classes_held: number;
  classes_attended: number;
};

export default function PaperDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [paperName, setPaperName] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    const fetchPaperDetails = async () => {
      try {
        // need a new backend endpoint: GET /student/paper/:id
        const response = await axios.get(`${API_URL}/student/paper/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaperName(response.data.paperName);
        setAttendanceRecords(response.data.attendanceRecords);
      } catch (err) {
        console.error('Failed to load paper details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, [token, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{paperName}</Text>
      <FlatList
        data={attendanceRecords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>Date: {item.class_date}</Text>
            <Text>
              Attended: {item.classes_attended}/{item.classes_held}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  record: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});