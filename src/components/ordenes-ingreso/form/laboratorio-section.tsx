import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PercentageInput } from "@/components/ui/percentage-input";
import {
  CreateOrdenFormData,
  UpdateOrdenFormData,
} from "../schemas/ordenIngresoSchema";
import { Badge } from "@/components/ui/badge";

interface LaboratorioSectionProps {
  form: UseFormReturn<CreateOrdenFormData | UpdateOrdenFormData>;
  isEditing?: boolean;
}

export function LaboratorioSection({
  form,
  isEditing,
}: LaboratorioSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Análisis de Laboratorio</h2>
        {isEditing && (
          <Badge variant="default" className="ml-auto">
            Editable
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PercentageInput
          id="porcentaje_humedad"
          label="Humedad"
          required
          helperText="Valores mayores a 100 se ajustarán automáticamente"
          error={errors.porcentaje_humedad?.message}
          {...register("porcentaje_humedad")}
        />

        <PercentageInput
          id="porcentaje_impureza"
          label="Impureza"
          required
          helperText="Valores mayores a 100 se ajustarán automáticamente"
          error={errors.porcentaje_impureza?.message}
          {...register("porcentaje_impureza")}
        />

        <div>
          <Label htmlFor="peso_hectolitrico">
            Peso Hectolítrico (kg/hl) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="peso_hectolitrico"
            type="number"
            step="0.01"
            min="0"
            className={errors.peso_hectolitrico ? "border-red-500" : ""}
            {...register("peso_hectolitrico")}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Debe ser mayor a 0
          </p>
          {errors.peso_hectolitrico && (
            <p className="text-sm text-red-500 mt-1">
              {errors.peso_hectolitrico.message}
            </p>
          )}
        </div>

        <PercentageInput
          id="porcentaje_grano_danado"
          label="Grano Dañado"
          required
          helperText="Valores mayores a 100 se ajustarán automáticamente"
          error={errors.porcentaje_grano_danado?.message}
          {...register("porcentaje_grano_danado")}
        />

        <PercentageInput
          id="porcentaje_grano_verde"
          label="Grano Verde"
          required
          helperText="Valores mayores a 100 se ajustarán automáticamente"
          error={errors.porcentaje_grano_verde?.message}
          {...register("porcentaje_grano_verde")}
        />
      </div>
    </div>
  );
}
