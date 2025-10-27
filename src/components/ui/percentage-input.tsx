// components/ui/percentage-input.tsx
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Percent } from "lucide-react";

interface PercentageInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showIcon?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      onChange,
      ...props
    },
    ref
  ) => {
    // Handler para limitar valores entre 0 y 100
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Si está vacío, permitir (para poder borrar)
      if (value === "") {
        onChange?.(e);
        return;
      }

      const numValue = parseFloat(value);

      // Si no es un número válido, no hacer nada
      if (isNaN(numValue)) {
        return;
      }

      // Limitar entre 0 y 100
      if (numValue > 100) {
        e.target.value = "100";
      } else if (numValue < 0) {
        e.target.value = "0";
      }

      onChange?.(e);
    };

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
            className={cn("pr-10", error && "border-red-500 ", className)}
            onChange={handleChange}
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
