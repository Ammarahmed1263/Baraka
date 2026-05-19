import { ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@context/ThemeContext';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

interface ErrorFallbackUIProps {
  error: Error | null;
  onReset: () => void;
  title?: string;
  subtitle?: string;
  showDetailsInProd?: boolean;
}

export function ErrorFallbackUI({
  error,
  onReset,
  title,
  subtitle,
  showDetailsInProd,
}: ErrorFallbackUIProps) {
  const { colors: C } = useTheme();
  const showDetails = __DEV__ || showDetailsInProd === true;

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 28,
      backgroundColor: C.background,
    },
    title: {
      fontSize: 28,
      color: C.text,
      marginBottom: 12,
      textAlign: 'center',
      writingDirection: 'rtl' as const,
    },
    subtitle: {
      fontSize: 16,
      color: C.tintLight,
      marginBottom: 32,
      lineHeight: 24,
      textAlign: 'center',
      writingDirection: 'rtl' as const,
    },
    errorDetails: {
      width: '100%',
      backgroundColor: C.backgroundSubtle,
      borderRadius: 16,
      padding: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: C.tintDark + '80',
    },
    errorLabel: {
      fontSize: 14,
      color: C.error,
      marginBottom: 8,
      writingDirection: 'rtl' as const,
    },
    errorMessage: {
      fontSize: 13,
      color: C.text,
      marginBottom: 8,
      writingDirection: 'rtl' as const,
    },
    errorStackContainer: {
      maxHeight: 180,
    },
    errorStack: {
      fontSize: 11,
      color: C.tintLight,
      fontFamily: 'monospace',
    },
    buttonContainer: {
      width: '100%',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Ionicons
        name="book-outline"
        size={80}
        color={C.error}
        style={{ marginBottom: 24 }}
      />

      <AppText weight="Bold" style={dynamicStyles.title}>
        {title || 'عذراً، حدث انقطاع بسيط'}
      </AppText>

      <AppText style={dynamicStyles.subtitle}>
        {subtitle ||
          'واجهنا مشكلة تقنية تعيق عرض الصفحة. يرجى إعادة المحاولة للمتابعة.'}
      </AppText>

      {showDetails && error && (
        <View style={dynamicStyles.errorDetails}>
          <AppText weight="Medium" style={dynamicStyles.errorLabel}>
            تفاصيل الخطأ:
          </AppText>
          <AppText style={dynamicStyles.errorMessage}>{error.message}</AppText>
          {error.stack && (
            <ScrollView style={dynamicStyles.errorStackContainer}>
              <AppText style={dynamicStyles.errorStack}>{error.stack}</AppText>
            </ScrollView>
          )}
        </View>
      )}

      <View style={dynamicStyles.buttonContainer}>
        <AppButton
          label="إعادة المحاولة"
          variant="primary"
          icon="refresh-cw"
          onPress={onReset}
          accessibilityLabel="إعادة المحاولة"
        />
      </View>
    </View>
  );
}