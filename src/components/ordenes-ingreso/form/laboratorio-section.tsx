import { UseFormReturn } from "react-hook-form";
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

        <PercentageInput
          id="peso_hectolitrico"
          label="Peso Hectolítrico (kg/hl)"
          required
          helperText="Valores mayores a 100 se ajustarán automáticamente"
          error={errors.peso_hectolitrico?.message}
          {...register("peso_hectolitrico")}
        />

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
