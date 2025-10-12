import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import URL from 'react-native-dotenv';



const API_URL = `${URL}:5000/api`; // Use your computer's IP

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams(); // Gets ?role=student from URL

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate role
  const validRole = ['student', 'teacher', 'admin'].includes(role as string)
    ? (role as 'student' | 'teacher' | 'admin')
    : null;

  if (!validRole) {
    // Redirect back if no valid role
    useEffect(() => {
      router.replace('/RoleSelection');
    }, []);
    return null;
  }

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
        role: validRole,
      });

      Alert.alert('Success', 'Registration successful! Please log in.');
      router.replace('/'); // Go to login
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);

      // Handle "user already exists" (HTTP 409)
      if (err.response?.status === 409) {
        Alert.alert(
          'Already Registered',
          'You are already registered. Please log in.',
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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