"use client";

import { useTranslations } from "next-intl";

interface Props {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "white" | "green" | "black";
  className?: string;
}

export default function LoadingSpinner({ size = "md", color = "primary", className = "" }: Props) {
  const t = useTranslations("global");

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const colorClasses = {
    primary: "border-green",
    secondary: "border-gray-500",
    success: "border-emerald-500",
    danger: "border-red-500",
    warning: "border-yellow-500",
    info: "border-cyan-500",
    white: "border-white",
    green: "border-green",
    black: "border-black",
  };

  const borderColorClass = colorClasses[color] ?? colorClasses.primary;
  const borderThicknessClass = size === "sm" ? "border-2" : "border-[3px]";

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid ${borderColorClass} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${borderThicknessClass} ${className}`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">{t("loading")}</span>
    </div>
  );
}
