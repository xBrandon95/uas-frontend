// components/ui/percentage-input.tsx
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Percent } from "lucide-react";

interface PercentageInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showIcon?: boolean;
}

const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        <div className="relative">
          <Input
            ref={ref}
            type="number"
            step="0.01"
            min="0"
            max="100"
            className={cn(
              "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
          {showIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Percent className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

PercentageInput.displayName = "PercentageInput";

export { PercentageInput };
