import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../../theme/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.l + (StatusBar.currentHeight || 0),
    paddingBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: SPACING.s,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.title,
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.surface,
    opacity: 0.8,
  },
});