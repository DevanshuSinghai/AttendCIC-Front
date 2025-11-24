// app/teacher/edit-attendance/[rollCallId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthProvider';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type AttendanceRecord = {
  roll_number: string;
  student_name: string;
  is_present: number; // 1 or 0
};

export default function EditAttendanceScreen() {
  const { token } = useAuth();
  const { rollCallId } = useLocalSearchParams<{ rollCallId: string }>();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token || !rollCallId) return;
    fetchAttendance();
  }, [token, rollCallId]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/teacher/roll-call/${rollCallId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.records || []);
    } catch (err: any) {
      console.error('Failed to load attendance:', err);
      Alert.alert('Error', err.response?.data?.error || 'Could not load attendance');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (rollNumber: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setSaving(true);

    try {
      await axios.patch(
        `${API_URL}/teacher/attendance/${rollCallId}`,
        { rollNumber, isPresent: newStatus === 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update UI
      setRecords(prev =>
        prev.map(rec =>
          rec.roll_number === rollNumber ? { ...rec, is_present: newStatus } : rec
        )
      );
    } catch (err: any) {
      console.error('Update failed:', err);
      Alert.alert('Error', 'Failed to update attendance. Please try again.');
      // Revert on error (optional)
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Attendance</Text>
      <Text style={styles.subtitle}>
        Tap a student to mark {saving ? 'saving...' : 'present/absent'}
      </Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.roll_number}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.studentRow,
              item.is_present === 1 ? styles.present : styles.absent,
            ]}
            onPress={() => !saving && toggleAttendance(item.roll_number, item.is_present)}
            disabled={saving}
          >
            <Text style={styles.studentName}>{item.student_name}</Text>
            <Text style={styles.rollNumber}>{item.roll_number}</Text>
            <View style={styles.statusBadge}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {item.is_present === 1 ? '✓ Present' : '✗ Absent'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No students found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1976D2' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  present: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  absent: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  studentName: { fontSize: 16, fontWeight: '600', flex: 1 },
  rollNumber: { fontSize: 14, color: '#666', marginRight: 12 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1976D2',
  },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});