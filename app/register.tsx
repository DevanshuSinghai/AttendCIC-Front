import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';


const API_URL = `http://10.85.108.203:5000/api`; // Use your computer's IP

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams(); // Gets ?role=student from URL

  const [email, setEmail] = useState('');
  const [roll_number, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [enrollment_number, setEnrollmentNumber] = useState('');
    const [batch_year, setBatchYear] = useState('');
  const [degree_name, setDegreeName] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate role
  const validRole = ['admin'].includes(role as string)
    ? (role as 'admin')
    : null;

  if (!validRole) {
    // Redirect back if no valid role
    console.log('This is admin only path')
    router.replace('/RoleSelection');
    // useEffect(() => {
      
    // }, []);
    return null;
  }

  const handleRegister = async () => {
    if (!email || !status || !roll_number) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        roll_number,
        enrollment_number,
        name,
        status,
        batch_year,
        degree_name,
        role: validRole,
      });
      console.log(response.data);
      Alert.alert('Success', 'Registration successful!');
      router.replace('/'); // Go to login
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);

      // Handle "user already exists" (HTTP 409)
      if (err.response?.status === 409) {
        Alert.alert(
          'Already Registered',
          'This user is already registered.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'), // Navigate to login
            },
          ]
        );
      } else {
        // Other errors (network, validation, etc.)
        Alert.alert('Error', err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as {validRole}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name (optional)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="roll number of student or faculty"
        value={roll_number}
        onChangeText={setRollNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Enrollment number if role is student"
        value={enrollment_number}
        onChangeText={setEnrollmentNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Status should be student or faculty"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="batch of the student - year when student took admission"
        value={batch_year}
        onChangeText={setBatchYear}
      />
      <TextInput
        style={styles.input}
        placeholder="degree of student"
        value={degree_name}
        onChangeText={setDegreeName}
      />
      

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Back to role selection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#1976D2',
  },
});