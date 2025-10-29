import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '50px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Something went wrong</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;