import "./LoadingSpinner.css";

function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClass = `spinner-${size}`;

  return <div className={`loading-spinner ${sizeClass} ${className}`} />;
}

export default LoadingSpinner;
