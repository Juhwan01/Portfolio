import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { NNButton } from '@components/ui/NNButton'

interface Props {
  readonly children: ReactNode
}

interface State {
  readonly hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="nn-label text-nn-tertiary mb-6">Runtime Error</p>
          <h1 className="text-6xl md:text-8xl font-bold nn-gradient-text mb-4">
            Oops
          </h1>
          <p className="text-nn-on-surface-variant mb-10 max-w-md mx-auto">
            예상치 못한 오류가 발생했습니다. 페이지를 새로고침해 주세요.
          </p>
          <NNButton
            size="lg"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            새로고침
          </NNButton>
        </div>
      )
    }

    return this.props.children
  }
}
