import React from "react";
import { Button } from "./button";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const LoadingButton = React.forwardRef(
  (
    {
      className,
      size = "sm",
      isPending,
      text,
      icon,
      type = "submit",
      ...props
    },
    ref
  ) => {
    const IconComponent = icon;
    const { theme } = useTheme();
    return (
      <Button
        ref={ref}
        type={type}
        className={cn("disabled:opacity-50", className)}
        size={size}
        disabled={isPending}
        {...props}
      >
        {isPending ? (
          <BeatLoader size={16} color={theme === "light" ? "white" : "black"} />
        ) : (
          <>
            {text}
            {icon && <IconComponent className="ml-2" size={16} />}
          </>
        )}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";
export default LoadingButton;
