import React from 'react';
import { TouchableOpacity, View, Text} from 'react-native';
import { Link } from 'expo-router';
// import { Button } from '@react-navigation/elements';
// const API_URL = 'http://192.168.1.39:5000/api';


export default function TeacherDashboard() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href={'/teacher/roll-call'} asChild>
        <TouchableOpacity
          style={{
            backgroundColor: '#1976D2',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Start Roll Call</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

