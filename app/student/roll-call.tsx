import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RollCallScreen() {
  const { rollCallId } = useLocalSearchParams<{ rollCallId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roll Call</Text>
      <Text style={styles.subtitle}>ID: {rollCallId || 'Unknown'}</Text>
      <Text>Location verification + biometric auth will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});