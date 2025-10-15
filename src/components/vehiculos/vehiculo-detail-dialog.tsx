"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
            {/* ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ID del Vehículo</p>
                <p className="text-xl font-bold">{vehiculo.id_vehiculo}</p>
              </div>
            </div>

            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 border-2 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Placa del Vehículo
                  </p>
                </div>
                <Badge
                  variant="default"
                  className="text-xl font-bold font-mono px-4 py-2"
                >
                  {vehiculo.placa}
                </Badge>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Marca
                  </p>
                </div>
                {vehiculo.marca_modelo ? (
                  <p className="text-lg font-semibold">
                    {vehiculo.marca_modelo}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin marca registrada
                  </p>
                )}
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
