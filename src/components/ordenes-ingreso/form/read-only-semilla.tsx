// src/components/ordenes-ingreso/form/ReadOnlySemilla.tsx
import { Label } from "@/components/ui/label";
import { OrdenIngreso } from "@/types";

interface ReadOnlySemillaProps {
  orden: OrdenIngreso;
}

export function ReadOnlySemilla({ orden }: ReadOnlySemillaProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Semilla</h2>

      <div className="bg-muted/30 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm">Semilla</Label>
            <p className="font-medium mt-1">{orden?.semilla?.nombre}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Variedad</Label>
            <p className="font-medium mt-1">{orden?.variedad?.nombre}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Categoría</Label>
            <p className="font-medium mt-1">
              {orden?.categoria_ingreso?.nombre}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">
              Nº Lote Campo
            </Label>
            <p className="font-medium mt-1">{orden?.nro_lote_campo || "-"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Nº Cupón</Label>
            <p className="font-medium mt-1">{orden?.nro_cupon || "-"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          * La información de semilla no puede modificarse en modo edición
        </p>
      </div>
    </div>
  );
}
