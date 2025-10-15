import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_URL = 'http://10.85.108.203:5000/api';

type Paper = {
  paperId: number;
  name: string;
  attendancePercentage: number;
};

type RollCall = {
  rollCallId: number;
  paperName: string;
  startTime: string;
  endTime: string;
  location: { lat: number; lng: number };
  radiusMeters: number;
};

export default function StudentDashboard() {
  const { user, token } = useAuth(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [enrolledPapers, setEnrolledPapers] = useState<Paper[]>([]);
  const [activeRollCalls, setActiveRollCalls] = useState<RollCall[]>([]);

  useEffect(() => {
    if (!token) return;
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOverallAttendance(response.data.overallAttendance || 0);
        setEnrolledPapers(response.data.enrolledPapers || []);
        setActiveRollCalls(response.data.activeRollCalls || []);
        console.log(enrolledPapers);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err.response?.data || err.message);
        Alert.alert('Error', 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleViewPapers = () => {
    router.push('/student/papers');
  };

  const handleAnswerRollCall = (rollCallId: number) => {
    router.push(`../roll-call?rollCallId=${rollCallId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Hello, {user?.student_name || user?.email || 'Student'}!
      </Text>

      {/* Overall Attendance */}
      <View style={styles.attendanceCard}>
        <Text style={styles.attendanceLabel}>Overall Attendance</Text>
        <Text style={styles.attendanceValue}>{overallAttendance}%</Text>
        <Text style={styles.attendanceSubtext}>attendance</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${Math.min(overallAttendance, 100)}%` }]}
          />
        </View>
      </View>

      {/* View Enrolled Papers */}
      <TouchableOpacity style={styles.card} onPress={handleViewPapers}>
        <View style={styles.cardIcon}>
          <Text>📚</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>View Enrolled Papers</Text>
          <Text style={styles.cardSubtitle}>
            {enrolledPapers.length > 0 
              ? `${enrolledPapers.length} papers enrolled` 
              : 'No papers found'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Answer Active Roll Call */}
      {activeRollCalls.length > 0 ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleAnswerRollCall(activeRollCalls[0].rollCallId)}
        >
          <View style={styles.cardIcon}>
            <Text>✅</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Answer Active Roll Call</Text>
            <Text style={styles.cardSubtitle}>
              For: {activeRollCalls[0].paperName}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text>⏳</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>No Active Roll Calls</Text>
            <Text style={styles.cardSubtitle}>
              Check back during class hours.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976D2',
  },
  attendanceCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  attendanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  attendanceSubtext: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#bbdefb',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976D2',
  },
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