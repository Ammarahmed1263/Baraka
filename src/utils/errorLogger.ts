import { ErrorInfo } from "react";
import * as Sentry from '@sentry/react-native';

export function logError(error: Error, errorInfo: ErrorInfo): void {
  if (__DEV__) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  } else {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      }
    });
  }
}
