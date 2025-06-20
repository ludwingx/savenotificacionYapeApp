import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
// First install @react-navigation/native package:
// npm install @react-navigation/native
// or
// yarn add @react-navigation/native
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './screens/HomeScreen';
import { NotificationDataScreen } from './screens/NotificationDataScreen';
import { COLORS } from './theme/theme';
import { Ionicons } from '@expo/vector-icons'; // Necesitarás instalar expo/vector-icons si no lo tienes

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Depósitos') {
                iconName = focused ? 'cash' : 'cash-outline';
              } else if (route.name === 'Notificaciones') {
                iconName = focused ? 'notifications' : 'notifications-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Depósitos" component={HomeScreen} />
          <Tab.Screen name="Notificaciones" component={NotificationDataScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
