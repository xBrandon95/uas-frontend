// src/components/ordenes-ingreso/form/ReadOnlyTransporte.tsx
import { Label } from "@/components/ui/label";
import { OrdenIngreso } from "@/types";

interface ReadOnlyTransporteProps {
  orden: OrdenIngreso;
}

export function ReadOnlyTransporte({ orden }: ReadOnlyTransporteProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Transporte</h2>

      <div className="bg-muted/30 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm">Semillera</Label>
            <p className="font-medium mt-1">{orden?.semillera?.nombre}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Cooperador</Label>
            <p className="font-medium mt-1">{orden?.cooperador?.nombre}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Conductor</Label>
            <p className="font-medium mt-1">
              {orden?.conductor?.nombre} - CI: {orden?.conductor?.ci}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Vehículo</Label>
            <p className="font-medium mt-1">
              {orden?.vehiculo?.marca_modelo} - Placa: {orden?.vehiculo?.placa}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          * La información de transporte no puede modificarse en modo edición
        </p>
      </div>
    </div>
  );
}
