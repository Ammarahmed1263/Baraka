import { Component, ComponentType, PropsWithChildren } from "react";

import { ErrorFallback, ErrorFallbackProps } from "@/components/ErrorFallback";

export type ErrorBoundaryProps = PropsWithChildren<{
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
}>;

type ErrorBoundaryState = { error: Error | null };

/**
 * This is a special case for for using the class components. Error boundaries must be class components because React only provides error boundary functionality through lifecycle methods (componentDidCatch and getDerivedStateFromError) which are not available in functional components.
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static defaultProps: {
    FallbackComponent: ComponentType<ErrorFallbackProps>;
  } = {
      FallbackComponent: ErrorFallback,
    };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (typeof this.props.onError === "function") {
      this.props.onError(error, info.componentStack);
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { FallbackComponent } = this.props;

    return this.state.error && FallbackComponent ? (
      <FallbackComponent
        error={this.state.error}
        resetError={this.resetError}
      />
    ) : (
      this.props.children
    );
  }
}



/* 
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Appearance,
  DevSettings,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Updates from 'expo-updates';

import { Colors } from '@/constants';
import { logError } from '@/utils/errorLogger';

import { ThemedButton } from './ThemedButton';


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
        fontFamily: 'Tajawal-Bold',
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
        writingDirection: 'rtl' as const,
      },
      subtitle: {
        fontSize: 16,
        fontFamily: 'Tajawal-Regular',
        color: colors.icon,
        marginBottom: 32,
        lineHeight: 24,
        textAlign: 'center',
        writingDirection: 'rtl' as const,
      },
      errorDetails: {
        width: '100%',
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: colors.dangerLight,
      },
      errorLabel: {
        fontSize: 14,
        fontFamily: 'Tajawal-Medium',
        color: colors.danger,
        marginBottom: 8,
        writingDirection: 'rtl' as const,
      },
      errorMessage: {
        fontSize: 13,
        fontFamily: 'Tajawal-Regular',
        color: colors.text,
        marginBottom: 8,
        writingDirection: 'rtl' as const,
      },
      errorStackContainer: {
        maxHeight: 180,
      },
      errorStack: {
        fontSize: 11,
        color: colors.icon,
        fontFamily: 'monospace',
      },
      retryButtonText: {
        fontSize: 17,
        fontFamily: 'Tajawal-Bold',
        letterSpacing: 0.5,
      },
    });

    return (
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.iconContainer}>
          <Ionicons name="book-outline" size={80} color={colors.danger} />
        </View>

        <Text style={dynamicStyles.title}>
          {this.props.title || 'عذراً، حدث انقطاع بسيط'}
        </Text>

        <Text style={dynamicStyles.subtitle}>
          {this.props.subtitle ||
            'واجهنا مشكلة تقنية تعيق عرض الصفحة. يرجى إعادة المحاولة للمتابعة.'}
        </Text>

        {showDetails && error && (
          <View style={dynamicStyles.errorDetails}>
            <Text style={dynamicStyles.errorLabel}>تفاصيل الخطأ:</Text>
            <Text style={dynamicStyles.errorMessage}>{error.message}</Text>
            {error.stack && (
              <ScrollView style={dynamicStyles.errorStackContainer}>
                <Text style={dynamicStyles.errorStack}>{error.stack}</Text>
              </ScrollView>
            )}
          </View>
        )}

        <ThemedButton
          onPress={this.resetError}
          variant="primary"
          accessibilityRole="button"
          accessibilityLabel="إعادة المحاولة"
        >
          <Text style={dynamicStyles.retryButtonText}>إعادة المحاولة</Text>
        </ThemedButton>
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
*/