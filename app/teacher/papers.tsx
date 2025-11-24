// app/teacher/papers.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type Paper = {
  paperId: number;
  name: string;
};

export default function TeacherPapers() {
  const { token } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    const fetchPapers = async () => {
      try {
        const res = await axios.get(`${API_URL}/teacher/papers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPapers(res.data.papers || []);
      } catch (err) {
        console.error('Failed to load papers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [token]);

  const handlePressPaper = (paperId: number) => {
    // Navigate to attendance view with paper pre-selected
    router.push({
      pathname: '/teacher/get-attendance',
      params: { paperId },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Papers ({papers.length})</Text>
      <FlatList
        data={papers}
        keyExtractor={(item) => item.paperId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.paperCard}
            onPress={() => handlePressPaper(item.paperId)}
          >
            <Text style={styles.paperName}>{item.name}</Text>
            <Text style={styles.paperId}>ID: {item.paperId}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No papers assigned.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1976D2' },
  paperCard: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paperName: { fontSize: 16, fontWeight: '600' },
  paperId: { fontSize: 12, color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});