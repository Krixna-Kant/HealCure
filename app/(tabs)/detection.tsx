import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function DetectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection Screen</Text>
      <Text>AI-powered detection features will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});