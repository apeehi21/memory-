import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Heart, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a000b] via-[#2d0515] to-[#12000a] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-pink-500/30 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center mx-auto mb-4 text-rose-300">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-pink-100 mb-2">
              Kuch Lamhon Ka Intezaar... ❤️
            </h2>
            <p className="text-pink-200/80 text-sm mb-6">
              Kripya ek baar page ko refresh karke dekhein.
            </p>
            <button
              onClick={this.handleReset}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg hover:from-rose-500 hover:to-pink-500 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Karein</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
