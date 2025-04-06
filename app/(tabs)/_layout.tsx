import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1E88E5' }} initialRouteName="home">
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="detection"
        options={{
          title: 'Detection',
          tabBarIcon: ({ color }) => <Ionicons name="scan" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
      name="map"
      options={{
        title: 'Map',
        tabBarIcon: ({ color }) => (
      <Ionicons name="map" size={24} color={color} />
    ),
    }}
    />
    </Tabs>
  );
}