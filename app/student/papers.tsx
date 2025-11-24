import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from "expo-constants"

const API_URL = Constants.expoConfig?.extra?.API_URL;
// const API_URL = 'http://192.168.1.9:5000/api';

type Paper = {
  paperId: number;
  name: string;
  attendancePercentage: number;
};

export default function StudentPapers() {
  const { token } = useAuth();
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchPapers = async () => {
      try {
        // Reuse dashboard API or create a dedicated one
        const response = await axios.get(`${API_URL}/student/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPapers(response.data.enrolledPapers || []);
      } catch (err) {
        console.error('Failed to load papers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [token]);

  const viewPaperDetails = (paperId: number) => {
    router.push(`/student/paper-details/${paperId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Papers</Text>
      <FlatList
        data={papers}
        keyExtractor={(item) => item.paperId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.paperCard}
            onPress={() => viewPaperDetails(item.paperId)}
          >
            <Text style={styles.paperName}>{item.name}</Text>
            <Text style={styles.paperAttendance}>{item.attendancePercentage}%</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paperCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 12,
  },
  paperName: {
    fontSize: 18,
    fontWeight: '600',
  },
  paperAttendance: {
    fontSize: 18,
    color: '#1976D2',
  },
});