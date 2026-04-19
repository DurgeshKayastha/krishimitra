import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">🌾</div>
            <h2 className="text-xl font-bold text-[#1B4332] mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
