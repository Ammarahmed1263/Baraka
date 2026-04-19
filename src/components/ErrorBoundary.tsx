import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Appearance,
  DevSettings,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Updates from 'expo-updates';

import Colors from "@constants/colors";
import { logError } from "@utils/errorLogger";
import { AppText } from './UI/AppText';

// import { ThemedButton } from './ThemedButton';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  title?: string;
  subtitle?: string;
  showDetailsInProd?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = async (): Promise<void> => {
    this.setState({ hasError: false, error: null });

    try {
      if (__DEV__) {
        DevSettings.reload();
      } else {
        await Updates.reloadAsync();
      }
    } catch (err) {
      console.warn('Failed to reload app:', err);
      // Fallback: just reset state
      this.setState({ hasError: false, error: null });
    }
  };

  private get colors() {
    const scheme = Appearance.getColorScheme() ?? 'light';
    return Colors[scheme];
  }

  renderDefaultFallback(): ReactNode {
    const { error } = this.state;
    const colors = this.colors;
    const showDetails = __DEV__ || this.props.showDetailsInProd === true;

    const dynamicStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
        backgroundColor: colors.background,
      },
      iconContainer: {
        marginBottom: 24,
      },
      title: {
        fontSize: 28,
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
        writingDirection: 'rtl' as const,
      },
      subtitle: {
        fontSize: 16,
        color: colors.tintLight,
        marginBottom: 32,
        lineHeight: 24,
        textAlign: 'center',
        writingDirection: 'rtl' as const,
      },
      errorDetails: {
        width: '100%',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: colors.tintDark + '80',
      },
      errorLabel: {
        fontSize: 14,
        color: colors.error,
        marginBottom: 8,
        writingDirection: 'rtl' as const,
      },
      errorMessage: {
        fontSize: 13,
        color: colors.text,
        marginBottom: 8,
        writingDirection: 'rtl' as const,
      },
      errorStackContainer: {
        maxHeight: 180,
      },
      errorStack: {
        fontSize: 11,
        color: colors.tintLight,
        fontFamily: 'monospace',
      },
      retryButtonText: {
        fontSize: 17,
        letterSpacing: 0.5,
      },
    });

    return (
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.iconContainer}>
          <Ionicons name="book-outline" size={80} color={colors.error} />
        </View>

        <AppText weight='Bold' style={dynamicStyles.title}>
          {this.props.title || 'عذراً، حدث انقطاع بسيط'}
        </AppText>

        <AppText style={dynamicStyles.subtitle}>
          {this.props.subtitle ||
            'واجهنا مشكلة تقنية تعيق عرض الصفحة. يرجى إعادة المحاولة للمتابعة.'}
        </AppText>

        {showDetails && error && (
          <View style={dynamicStyles.errorDetails}>
            <AppText weight='Medium' style={dynamicStyles.errorLabel}>تفاصيل الخطأ:</AppText>
            <AppText style={dynamicStyles.errorMessage}>{error?.message}</AppText>
            {error?.stack && (
              <ScrollView style={dynamicStyles.errorStackContainer}>
                <AppText style={dynamicStyles.errorStack}>{error?.stack}</AppText>
              </ScrollView>
            )}
          </View>
        )}

        {/* <ThemedButton
          onPress={this.resetError}
          variant="primary"
          accessibilityRole="button"
          accessibilityLabel="إعادة المحاولة"
        >
          <AppText weight='Bold' style={dynamicStyles.retryButtonText}>إعادة المحاولة</AppText>
        </ThemedButton> */}
      </View>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
        ? this.props.fallback(this.resetError)
        : this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

