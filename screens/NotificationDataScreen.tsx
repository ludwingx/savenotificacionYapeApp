import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
// Reemplazar la importación anterior
// import NotificationListener from 'react-native-notification-listener';

// Con la nueva biblioteca
let RNAndroidNotificationListener;
try {
  RNAndroidNotificationListener = require('react-native-android-notification-listener').default;
  console.log('Successfully imported RNAndroidNotificationListener');
} catch (error) {
  console.error('Failed to import RNAndroidNotificationListener:', error);
  // Crear un objeto fallback con métodos vacíos para evitar crashes
  RNAndroidNotificationListener = {
    getPermissionStatus: async () => 'denied',
    requestPermission: () => {},
    onNotificationReceived: (callback) => {
      console.warn('Mock onNotificationReceived called - module not available');
      return () => {}; // Return cleanup function
    }
  };
}


interface RawNotification {
  id: string;
  packageName: string;
  title: string;
  text: string;
  timestamp: number;
  rawData?: string; // Para almacenar el JSON completo como string
}

// Esta función simula la obtención de datos de notificaciones
// Deberás reemplazarla con tu implementación real para capturar notificaciones
// Replace the simulated function with a real implementation
const fetchRawNotifications = async (): Promise<RawNotification[]> => {
  try {
    const storedNotifications = await AsyncStorage.getItem('notifications');
    if (storedNotifications) {
      return JSON.parse(storedNotifications);
    }
    return [];
  } catch (error) {
    console.error('Error fetching notifications from storage:', error);
    return [];
  }
};

export const NotificationDataScreen = () => {
  const [notifications, setNotifications] = useState<RawNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [listenerAvailable, setListenerAvailable] = useState(false);

  // Verificar si el NotificationListener está disponible
  const checkListenerAvailability = () => {
    if (typeof RNAndroidNotificationListener !== 'undefined' && RNAndroidNotificationListener !== null) {
      console.log('RNAndroidNotificationListener is available');
      setListenerAvailable(true);
      return true;
    } else {
      console.error('RNAndroidNotificationListener is not available');
      setListenerAvailable(false);
      Alert.alert(
        'Module Not Available',
        'The notification listener module is not available. This may be due to a missing native module or installation issue.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  // Función para verificar y solicitar permisos
  const checkNotificationPermission = async () => {
    try {
      if (!checkListenerAvailability()) return;
      
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      console.log('Notification permission status:', status);
      
      if (status === 'authorized') {
        setPermissionGranted(true);
        // Load notifications when permission is granted
        loadNotifications();
      } else {
        setPermissionGranted(false);
        // Detectar si es un dispositivo Xiaomi/Redmi
        const isXiaomiDevice = /redmi|xiaomi/i.test(Device.modelName || '');
        
        // Mostrar alerta al usuario con instrucciones específicas para Xiaomi
        Alert.alert(
          'Permiso requerido',
          isXiaomiDevice 
            ? 'En dispositivos Xiaomi/Redmi, debes habilitar manualmente los permisos:\n\n1. Ve a Ajustes > Aplicaciones > Permisos > Otras aplicaciones\n2. Busca esta aplicación\n3. Activa "Mostrar notificaciones" y "Acceso a notificaciones"\n4. También activa "Autoarranque" en Ajustes > Aplicaciones > Administrar aplicaciones'
            : 'Esta aplicación necesita acceso a las notificaciones para funcionar correctamente. Por favor, habilita el acceso en la siguiente pantalla.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Configurar', 
              onPress: () => {
                if (listenerAvailable) {
                  RNAndroidNotificationListener.requestPermission();
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  const loadNotifications = async () => {
    setRefreshing(true);
    try {
      const data = await fetchRawNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Verificar si el listener está disponible primero
    const isAvailable = checkListenerAvailability();
    if (isAvailable) {
      loadNotifications();
      checkNotificationPermission();
    }
    
    // No es necesario configurar un listener aquí, ya que esta biblioteca
    // usa un HeadlessJS task que debe configurarse en index.js
    
    return () => {
      // No hay listener que limpiar en este componente
    };
  }, [permissionGranted, listenerAvailable]);

  // Verificar el estado del permiso periódicamente
  useEffect(() => {
    const checkPermissionInterval = setInterval(() => {
      checkNotificationPermission();
    }, 5000); // Verificar cada 5 segundos
    
    return () => clearInterval(checkPermissionInterval);
  }, []);

  const renderItem = ({ item }: { item: RawNotification }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.packageName}>{item.packageName}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      {item.rawData && (
        <View style={styles.rawDataContainer}>
          <Text style={styles.rawDataLabel}>Datos crudos:</Text>
          <Text style={styles.rawData}>{item.rawData}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadNotifications}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  packageName: {
    ...FONTS.regular,
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  title: {
    ...FONTS.bold,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  text: {
    ...FONTS.regular,
    marginBottom: SPACING.s,
  },
  timestamp: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: SPACING.s,
  },
  rawDataContainer: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.s,
    borderRadius: 4,
    marginTop: SPACING.xs,
  },
  rawDataLabel: {
    ...FONTS.bold,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  rawData: {
    ...FONTS.regular,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});