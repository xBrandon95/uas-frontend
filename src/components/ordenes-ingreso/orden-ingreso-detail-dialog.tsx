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
import { FileText, Truck, Wheat, Scale, Loader2 } from "lucide-react";
import { useOrdenIngreso } from "@/hooks/use-ordenes-ingreso";

interface OrdenIngresoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenId: number | null;
}

export function OrdenIngresoDetailDialog({
  open,
  onOpenChange,
  ordenId,
}: OrdenIngresoDetailDialogProps) {
  const { data: orden, isLoading } = useOrdenIngreso(ordenId);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("es-BO");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle de Orden de Ingreso
          </DialogTitle>
          <DialogDescription>
            Información completa de la orden
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        ) : orden ? (
          <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Número de Orden</p>
                <p className="text-2xl font-bold font-mono">
                  {orden.numero_orden}
                </p>
              </div>
              <Badge>{orden.estado}</Badge>
            </div>

            <Separator />

            {/* Transporte */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Truck className="h-4 w-4" />
                Información de Transporte
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Semillera</p>
                  <p className="font-medium">{orden.semillera?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cooperador</p>
                  <p className="font-medium">{orden.cooperador?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conductor</p>
                  <p className="font-medium">{orden.conductor?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehículo</p>
                  <p className="font-medium font-mono">
                    {orden.vehiculo?.placa}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Semilla */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Wheat className="h-4 w-4" />
                Información de Semilla
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Semilla</p>
                  <p className="font-medium">{orden.semilla?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variedad</p>
                  <p className="font-medium">{orden.variedad?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">
                    {orden.categoria_ingreso?.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nº Bolsas</p>
                  <p className="font-medium">{orden.nro_bolsas || "N/A"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pesaje */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Scale className="h-4 w-4" />
                Datos de Pesaje
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Peso Bruto</p>
                  <p className="font-medium font-mono">
                    {Number(orden.peso_bruto).toFixed(2) || "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso Tara</p>
                  <p className="font-medium font-mono">
                    {Number(orden.peso_tara).toFixed(2) || "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso Neto</p>
                  <p className="font-medium font-mono">
                    {Number(orden.peso_neto).toFixed(2) || "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso Líquido</p>
                  <p className="font-medium font-mono">
                    {Number(orden.peso_liquido).toFixed(2) || "-"} kg
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Laboratorio */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                {/* <Flask className="h-4 w-4" /> */}
                Análisis de Laboratorio
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">% Humedad</p>
                  <p className="font-medium">
                    {Number(orden.porcentaje_humedad).toFixed(2) || "-"}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">% Impureza</p>
                  <p className="font-medium">
                    {Number(orden.porcentaje_impureza).toFixed(2) || "-"}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    % Grano Dañado
                  </p>
                  <p className="font-medium">
                    {Number(orden.porcentaje_grano_danado).toFixed(2) || "-"}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">% Grano Verde</p>
                  <p className="font-medium">
                    {Number(orden.porcentaje_grano_verde).toFixed(2) || "-"}%
                  </p>
                </div>
              </div>
            </div>

            {orden.observaciones && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Observaciones
                  </p>
                  <p className="text-sm">{orden.observaciones}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la orden
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
