import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DashBord from '../Admin/DashBord';
import ClothingForm from '../Admin/ClothingForm';

const Tab = createBottomTabNavigator();

function Admin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ClothingForm') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={DashBord} />
      <Tab.Screen name="ClothingForm" options={{ headerShown: false }} component={ClothingForm} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default Admin;