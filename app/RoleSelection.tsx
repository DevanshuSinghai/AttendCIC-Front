import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from 'expo-router';

export default function RoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    console.log(`in role selection ${role}`)
    router.push(`/register?role=${role}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        
        <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelect('student')}>
          <View style={styles.iconContainer}><Text style={styles.icon}></Text></View>
          <Text style={styles.roleText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelect('teacher')}>
          <View style={styles.iconContainer}><Text style={styles.icon}></Text></View>
          <Text style={styles.roleText}>Teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelect('admin')}>
          <View style={styles.iconContainer}><Text style={styles.icon}></Text></View>
          <Text style={styles.roleText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 40,
  },
  roleButton: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
    color: '#1976D2',
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});