import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import * as Location from 'expo-location';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import Constants from "expo-constants"


type Paper = {
  paper_number: number;
  paper_name: string;
};


export default function TeacherRollCallScreen() {
  const { user, token } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(10); // minutes
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [teacherLocation, setTeacherLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [classCount, setClassCount] = useState<number>(1);
  
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  // const API_URL = 'http://192.168.1.9:5000/api';

  // Fetch all papers
  const fetchPapers = async () => {
    try {
      const response = await axios.get(`${API_URL}/papers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(response.data);
      if (response.data.length > 0) {
        setSelectedPaper(response.data[0].paper_number);
      }
    } catch (error: any) {
      console.error('Fetch papers error:', error);
      Alert.alert('Error', 'Could not load papers');
    } finally {
      setLoading(false);
    }
  };

  // Get teacher's current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("give permission");
        Alert.alert('Permission Needed', 'Allow location to set classroom position');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setTeacherLocation({ lat: coords.latitude, lng: coords.longitude });
    } catch (err) {
      console.error('Location error:', err);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  useEffect(() => {
    if (token) {
      fetchPapers();
      getLocation();
    }
  }, [token]);

  const handleStartRollCall = async () => {
    if (!selectedPaper || !teacherLocation || !token) {
      Alert.alert('Missing Info', 'Please select a paper and allow location');
      return;
    }

    setStarting(true);

    try {
      await axios.post(
        `${API_URL}/papers/${selectedPaper}/start-roll-call`,
        {
          durationMinutes: duration,
          location_lat: teacherLocation.lat,
          location_lng: teacherLocation.lng,
          class_count: classCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Roll call started successfully!', [
        { text: 'OK', onPress: () => console.log('Roll call active') }
      ]);
    } catch (error: any) {
      console.error('Start roll call error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to start roll call');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Roll Call</Text>

      <Text style={styles.label}>Select Paper</Text>
      <Picker
        selectedValue={selectedPaper}
        onValueChange={setSelectedPaper}
        style={styles.picker}
      >
        {papers.map(paper => (
          <Picker.Item
            key={paper.paper_number}
            label={paper.paper_name}
            value={paper.paper_number}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Duration (minutes)</Text>
      <Picker
        selectedValue={duration}
        onValueChange={setDuration}
        style={styles.picker}
      >
        {[5, 10, 15, 20, 30].map(min => (
          <Picker.Item key={min} label={`${min} min`} value={min} />
        ))}
      </Picker>

      <Text style={styles.label}>Number of Classes</Text>
      <Picker
        selectedValue={classCount}
        onValueChange={setClassCount}
        style={styles.picker}
      >
        {[1, 2, 3, 4, 5].map(n => (
          <Picker.Item key={n} label={`${n} class${n > 1 ? 'es' : ''}`} value={n} />
        ))}
      </Picker>

      {teacherLocation && (
        <Text style={styles.info}>
          Classroom Location: {teacherLocation.lat.toFixed(5)}, {teacherLocation.lng.toFixed(5)}
        </Text>
      )}

      <Button
        title={starting ? "Starting..." : "Start Roll Call"}
        onPress={handleStartRollCall}
        disabled={starting || !teacherLocation}
        color="#34C759"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});