"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Truck, Tag, Car, Loader2 } from "lucide-react";
import { useVehiculo } from "@/hooks/use-vehiculos";

interface VehiculoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiculoId: number | null;
}

export function VehiculoDetailDialog({
  open,
  onOpenChange,
  vehiculoId,
}: VehiculoDetailDialogProps) {
  const { data: vehiculo, isLoading } = useVehiculo(vehiculoId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Detalle del Vehículo
          </DialogTitle>
          <DialogDescription>
            Información completa del vehículo
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : vehiculo ? (
          <div className="space-y-6">
            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Marca/Modelo
                  </p>
                </div>
                <p className="text-base">
                  {vehiculo.marca_modelo || (
                    <span className="text-muted-foreground italic">
                      Sin marca/modelo registrado
                    </span>
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Placa del Vehículo
                  </p>
                </div>
                <p className="text-base font-bold font-mono">
                  {vehiculo.placa}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del vehículo
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
