import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthProvider'; // Assuming you have an AuthProvider
import axios from 'axios';
import Constants from 'expo-constants';

// Assuming the API_URL setup is similar to your StudentDashboard
const API_URL = Constants.expoConfig?.extra?.API_URL;

type Paper = {
  paperId: number;
  name: string;
};

export default function TeacherDashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolledPapers, setEnrolledPapers] = useState<Paper[]>([]); // To show papers count

  useEffect(() => {
    if (!token) return;
    const fetchTeacherPapers = async () => {
      try {
        // Fetch papers taught by the teacher to display the count
        const response = await axios.get(`${API_URL}/teacher/papers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledPapers(response.data.papers || []);
      } catch (err: any) {
        console.error('Teacher papers fetch error:', err.response?.data || err.message);
        // You might want to remove the Alert if it's too aggressive on every load
        // Alert.alert('Error', 'Failed to load teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherPapers();
  }, [token]);

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
        Welcome, {user?.faculty_name || user?.email || 'Teacher'}!
      </Text>

      {/* 1. Start Roll Call Card */}
      <Link href={'/teacher/roll-call'} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Text>🔔</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Start New Roll Call</Text>
            <Text style={styles.cardSubtitle}>
              Initiate attendance for a class.
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* 2. View Enrolled Papers Card (View My Papers) */}
      <Link href={'/teacher/papers'} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Text>📚</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View My Papers</Text>
            <Text style={styles.cardSubtitle}>
              {enrolledPapers.length} papers taught.
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* 3. View Attendance Card */}
      <Link href={'/teacher/get-attendance'} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Text>📊</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View Attendance</Text>
            <Text style={styles.cardSubtitle}>
              Check attendance records for your papers.
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* 4. Edit Previous Roll Call Card */}
      <Link href={'/teacher/edit-roll-call'} asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Text>✏️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Edit Previous Roll Call</Text>
            <Text style={styles.cardSubtitle}>
              Review or manually edit past attendance.
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    // shadow effects to match a card look (optional)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd', // Light blue background for the icon
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