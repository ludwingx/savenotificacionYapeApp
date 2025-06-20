import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../../theme/theme';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/error.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: SPACING.l,
    opacity: 0.8,
  },
  message: {
    ...FONTS.medium,
    fontSize: SIZES.subheading,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subMessage: {
    ...FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.text.hint,
    textAlign: 'center',
  },
});