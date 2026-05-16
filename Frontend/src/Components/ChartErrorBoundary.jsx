import React from "react";

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chart rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[220px] rounded-3xl border border-[#F2D7D7] bg-[#FEF2F2] p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold text-[#323643]">Chart Unavailable</p>
          <p className="text-xs text-[#706C61] mt-2 max-w-sm">
            This visualization failed to load. Refresh the page or try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
