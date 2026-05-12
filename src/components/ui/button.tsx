import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal-indigo focus:ring-offset-2 focus:ring-offset-deep-space disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-signal-indigo text-white hover:bg-indigo-600 active:bg-indigo-700 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25": variant === "primary",
            "bg-surface border border-border text-text-primary hover:border-signal-indigo hover:bg-surface/80": variant === "secondary",
            "bg-transparent border border-border text-text-primary hover:bg-surface hover:border-signal-indigo": variant === "ghost",
            "h-12 px-6 text-base rounded-lg": size === "default",
            "h-10 px-4 text-sm rounded-md": size === "sm",
            "h-14 px-8 text-lg rounded-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };