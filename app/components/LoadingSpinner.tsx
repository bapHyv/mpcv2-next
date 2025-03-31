"use client";

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "white" | "green" | "black";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-blue-500",
    secondary: "border-gray-500",
    success: "border-green-500",
    danger: "border-red-500",
    warning: "border-yellow-500",
    info: "border-cyan-500",
    white: "border-white",
    green: "border-green",
    black: "border-black",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid ${colorClasses[color]} border-r-transparent ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
