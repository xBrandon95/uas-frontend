// src/components/ordenes-ingreso/form/ObservacionesSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CreateOrdenFormData,
  UpdateOrdenFormData,
} from "../schemas/ordenIngresoSchema";

interface ObservacionesSectionProps {
  form: UseFormReturn<CreateOrdenFormData | UpdateOrdenFormData>;
  isEditing?: boolean;
}

export function ObservacionesSection({
  form,
  isEditing,
}: ObservacionesSectionProps) {
  const { register } = form;

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Observaciones</h2>
        {isEditing && (
          <Badge variant="default" className="ml-auto">
            Editable
          </Badge>
        )}
      </div>
      <Textarea
        id="observaciones"
        {...register("observaciones")}
        rows={4}
        placeholder="Observaciones adicionales..."
      />
    </div>
  );
}
