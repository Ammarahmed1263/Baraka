import { Component, ErrorInfo, ReactNode } from 'react';
import { reloadApp } from '@utils/device';
import { logError } from '@utils/errorLogger';
import { ErrorFallbackUI } from './UI/ErrorFallbackUI';

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
    await reloadApp();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.resetError);
      }
      return (
        <ErrorFallbackUI
          error={this.state.error}
          onReset={this.resetError}
          title={this.props.title}
          subtitle={this.props.subtitle}
          showDetailsInProd={this.props.showDetailsInProd}
        />
      );
    }
    return this.props.children;
  }
}