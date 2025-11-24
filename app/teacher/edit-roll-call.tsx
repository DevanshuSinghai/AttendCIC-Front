// app/teacher/edit-roll-call.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type EditableRollCall = {
  id: number;
  paper_number: number;
  paper_name: string;
  scheduled_date: string; // "YYYY-MM-DD"
  start_time: string;     // "HH:MM:SS" or Date object
  end_time: string;
  class_count: number;
};

export default function EditRollCall() {
  const { token } = useAuth();
  const [rollCalls, setRollCalls] = useState<EditableRollCall[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    const fetchRollCalls = async () => {
      try {
        const res = await axios.get(`${API_URL}/teacher/edit-roll-call`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRollCalls(res.data.editableRollCalls || []);
      } catch (err) {
        console.error('Failed to load editable roll calls:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRollCalls();
  }, [token]);

  const handleEdit = (rollCallId: number) => {
    router.push(`/teacher/edit-attendance/${rollCallId}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading editable roll calls...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editable Roll Calls</Text>
      <FlatList
        data={rollCalls}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const date = new Date(item.scheduled_date);
          const displayDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          // Format time (assume start_time is "HH:MM:SS")
          const [hours, minutes] = item.start_time.split(':');
          const time = `${hours}:${minutes}`;

          return (
            <TouchableOpacity
              style={styles.rcCard}
              onPress={() => handleEdit(item.id)}
            >
              <Text style={styles.rcPaper}>{item.paper_name}</Text>
              <Text style={styles.rcDate}>{displayDate} • {time}</Text>
              <Text style={styles.rcClass}>Class #{item.class_count}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No editable roll calls found (must be ended & older than 5 mins).
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1976D2' },
  rcCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rcPaper: { fontSize: 16, fontWeight: '600', color: '#333' },
  rcDate: { fontSize: 14, color: '#555', marginTop: 4 },
  rcClass: { fontSize: 12, color: '#888', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});