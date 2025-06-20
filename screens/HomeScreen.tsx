import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
  Animated,
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle
} from 'react-native';
import { DepositoItem } from '../components/DepositoItem';
import { EmptyState } from '../components/ui/EmptyState';
import { AppHeader } from '../components/ui/AppHeader';
import { getDepositos } from '../services/depositoService';
import { Deposito } from '../models/Deposito';
import { COLORS, FONTS, SIZES, SPACING, SHADOWS, BORDER_RADIUS } from '../theme/theme';

export const HomeScreen: React.FC = () => {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadDepositos = async () => {
    try {
      setError(null);
      const data = await getDepositos();
      setDepositos(data);
    } catch (err) {
      console.error('Error loading depositos:', err);
      setError('No se pudieron cargar los depósitos. Intente nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDepositos();
  };

  // Calcular el monto total de depósitos
  const calcularMontoTotal = () => {
    return depositos.reduce((total, deposito) => total + deposito.monto, 0).toFixed(2);
  };

  useEffect(() => {
    loadDepositos();
  }, []);

  // Animación para el header al hacer scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],  // Aumentado significativamente para una transición más suave
    outputRange: [SIZES.xxxl + 50, SIZES.xl],  // Aumentado considerablemente la altura inicial
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Depósitos Yape" subtitle="Cargando tus depósitos..." />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando depósitos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppHeader title="Depósitos Yape" subtitle="Ocurrió un error" />
        <View style={styles.centered}>
          <Image 
            source={require('../assets/error.png')} 
            style={styles.errorImage as ImageStyle}
            resizeMode="contain"
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadDepositos}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Depósitos Yape" 
        subtitle={`${depositos.length} depósitos registrados`} 
      />
      
      {depositos.length > 0 && (
        <Animated.View style={[styles.summaryCard, { height: headerHeight, opacity: headerOpacity }]}>
          <Text style={styles.summaryTitle}>Resumen de Depósitos</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Total Recibido</Text>
              <Text style={styles.summaryItemValue}>BOB {calcularMontoTotal()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Cantidad</Text>
              <Text style={styles.summaryItemValue}>{depositos.length}</Text>
            </View>
          </View>
        </Animated.View>
      )}
      
      {depositos.length === 0 ? (
        <EmptyState 
          message="No hay depósitos registrados" 
          subMessage="Las notificaciones de Yape aparecerán aquí cuando las recibas"
        />
      ) : (
        <Animated.FlatList
          data={depositos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <DepositoItem deposito={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...FONTS.medium,
    marginTop: SPACING.m,
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
  },
  errorImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.l,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    ...SHADOWS.small,
  },
  retryButtonText: {
    fontSize: SIZES.body,
    color: COLORS.surface,
    fontFamily: FONTS.medium.fontFamily,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: SPACING.s,
    paddingBottom: SPACING.xl,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.m,
    marginVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    paddingBottom: SPACING.xl,  // Reducido el padding inferior
    paddingTop: SPACING.m,      // Reducido el padding superior
    minHeight: 130,             // Ajustado la altura mínima
    ...SHADOWS.medium,
  },
  summaryTitle: {
    ...FONTS.bold,
    fontSize: SIZES.subheading,
    color: COLORS.surface,
    marginBottom: SPACING.xs,   // Reducido el margen inferior
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between' as const,
    marginTop: SPACING.xs,      // Reducido el margen superior
    paddingHorizontal: SPACING.s,
  },
  summaryItem: {
    flex: 1,
    paddingVertical: SPACING.m,  // Aumentado el padding vertical
  },
  summaryItemLabel: {
    ...FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.surface,
    opacity: 0.8,
    marginBottom: SPACING.s,     // Aumentado el margen inferior
  },
  summaryItemValue: {
    ...FONTS.bold,
    fontSize: SIZES.title,
    color: COLORS.surface,
    marginTop: SPACING.xs,       // Añadido margen superior
  } as TextStyle
});