export const COLORS = {
  primary: '#6200EE',       // Color principal (morado)
  primaryDark: '#3700B3',   // Variante oscura del color principal
  primaryLight: '#BB86FC',  // Variante clara del color principal
  secondary: '#03DAC6',     // Color secundario (turquesa)
  secondaryDark: '#018786', // Variante oscura del color secundario
  background: '#F8F9FA',    // Fondo de la aplicación
  surface: '#FFFFFF',       // Superficie de las tarjetas
  error: '#B00020',         // Color de error
  text: {
    primary: '#212121',     // Texto principal
    secondary: '#757575',    // Texto secundario
    disabled: '#9E9E9E',     // Texto deshabilitado
    hint: '#9E9E9E',         // Texto de sugerencia
  },
  success: '#4CAF50',        // Color de éxito (verde)
  warning: '#FFC107',        // Color de advertencia (amarillo)
  info: '#2196F3',           // Color de información (azul)
  divider: '#EEEEEE',        // Color de divisores
  yape: '#6A1B9A',           // Color específico para Yape (morado más oscuro)
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
};

export const SIZES = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 80,
  // Tamaños de fuente
  caption: 12,
  body: 14,
  subheading: 16,
  title: 20,
  headline: 24,
  display: 34,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  circular: 9999,
};