import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Deposito } from '../models/Deposito';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/theme';

interface DepositoItemProps {
  deposito: Deposito;
  onPress?: () => void;
}

export const DepositoItem: React.FC<DepositoItemProps> = ({ deposito, onPress }) => {
  // Formatear la fecha para mostrarla de manera más amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Determinar el color de fondo basado en el dominio
  const getDomainColor = (domain: string | null) => {
    if (!domain) return COLORS.surface;
    
    switch(domain.toLowerCase()) {
      case 'yape':
        return COLORS.yape;
      default:
        return COLORS.primary;
    }
  };

  const domainColor = getDomainColor(deposito.dominio);
  const fecha = formatDate(deposito.creado_en);

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={[styles.domainIndicator, { backgroundColor: domainColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.domainContainer}>
            <Text style={styles.dominio}>{deposito.dominio || 'Desconocido'}</Text>
            <View style={[styles.origenBadge, { backgroundColor: domainColor + '20' }]}>
              <Text style={[styles.origen, { color: domainColor }]}>{deposito.origen}</Text>
            </View>
          </View>
          <Text style={styles.fecha}>{fecha}</Text>
        </View>
        
        <Text style={styles.mensaje}>{deposito.mensaje}</Text>
        
        <View style={styles.footer}>
          <View style={styles.montoContainer}>
            <Text style={styles.montoLabel}>Monto recibido:</Text>
            <Text style={styles.monto}>
              {deposito.moneda} {deposito.monto.toFixed(2)}
            </Text>
          </View>
          <View style={styles.nombreContainer}>
            <Text style={styles.nombreLabel}>De:</Text>
            <Text style={styles.nombre}>{deposito.nombre}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.m,
    marginVertical: SPACING.s,
    marginHorizontal: SPACING.m,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  domainIndicator: {
    width: 6,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  domainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dominio: {
    ...FONTS.bold,
    fontSize: SIZES.subheading,
    color: COLORS.text.primary,
    marginRight: SPACING.s,
  },
  origenBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
    marginTop: 2,
  },
  origen: {
    ...FONTS.medium,
    fontSize: SIZES.caption,
  },
  fecha: {
    ...FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.text.secondary,
  },
  mensaje: {
    ...FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.m,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.s,
    gap: SPACING.xs,
  },
  montoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  montoLabel: {
    ...FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.text.secondary,
  },
  monto: {
    ...FONTS.bold,
    fontSize: SIZES.subheading,
    color: COLORS.success,
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nombreLabel: {
    ...FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  nombre: {
    ...FONTS.medium,
    fontSize: SIZES.caption,
    color: COLORS.text.primary,
  },
});