// src/components/ordenes-ingreso/form/PesajeSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreateOrdenFormData,
  UpdateOrdenFormData,
} from "../schemas/ordenIngresoSchema";

interface PesajeSectionProps {
  form: UseFormReturn<CreateOrdenFormData | UpdateOrdenFormData>;
  pesoNetoCalculado?: number;
  isEditing?: boolean;
}

export function PesajeSection({
  form,
  pesoNetoCalculado,
  isEditing,
}: PesajeSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Datos de Pesaje</h2>
        {isEditing && (
          <Badge variant="default" className="ml-auto">
            Editable
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* PESO BRUTO */}
        <div>
          <Label htmlFor="peso_bruto">
            Peso Bruto (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="peso_bruto"
            type="number"
            step="0.01"
            className={errors.peso_bruto ? "border-red-500" : ""}
            {...register("peso_bruto")}
          />
          {errors.peso_bruto && (
            <p className="text-sm text-red-500 mt-1">Campo requerido</p>
          )}
        </div>

        {/* PESO TARA */}
        <div>
          <Label htmlFor="peso_tara">
            Peso Tara (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="peso_tara"
            type="number"
            step="0.01"
            className={errors.peso_tara ? "border-red-500" : ""}
            {...register("peso_tara")}
          />
          {errors.peso_tara && (
            <p className="text-sm text-red-500 mt-1">Campo requerido</p>
          )}
        </div>

        {/* PESO NETO - Calculado automáticamente */}
        <div>
          <Label htmlFor="peso_neto">
            Peso Neto (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="peso_neto"
            type="number"
            step="0.01"
            value={pesoNetoCalculado || ""}
            readOnly
            className="bg-muted/50 cursor-not-allowed"
          />
          <p className="text-blue-600 text-xs ml-2">
            Peso Neto = Peso Bruto - Peso Tara
          </p>
        </div>

        {/* PESO LÍQUIDO */}
        <div>
          <Label htmlFor="peso_liquido">
            Peso Líquido (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="peso_liquido"
            type="number"
            step="0.01"
            className={errors.peso_liquido ? "border-red-500" : ""}
            {...register("peso_liquido")}
          />
          {errors.peso_liquido && (
            <p className="text-sm text-red-500 mt-1">Campo requerido</p>
          )}
        </div>
      </div>
    </div>
  );
}
