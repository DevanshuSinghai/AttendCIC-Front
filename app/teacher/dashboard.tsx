import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@react-navigation/elements';
const API_URL = 'http://10.85.108.203:5000/api';


export default function TeacherDashboard() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href={`${API_URL}/teacher/roll-call`} asChild>
        Start Roll Call
      </Link>
    </View>
  );
}

