import { View, Text, StyleSheet } from 'react-native';

export default function MapFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map not supported on web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});