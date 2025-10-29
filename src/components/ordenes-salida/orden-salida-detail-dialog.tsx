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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TruckIcon,
  User,
  Store,
  Wheat,
  Calendar,
  Package,
  Loader2,
  MapPin,
} from "lucide-react";
import { useOrdenSalida } from "@/hooks/use-ordenes-salida";

interface OrdenSalidaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenId: number | null;
}

export function OrdenSalidaDetailDialog({
  open,
  onOpenChange,
  ordenId,
}: OrdenSalidaDetailDialogProps) {
  const { data: orden, isLoading } = useOrdenSalida(ordenId);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<
      string,
      {
        variant: "default" | "pending" | "admin" | "success";
        label: string;
      }
    > = {
      pendiente: { variant: "pending", label: "Pendiente" },
      en_transito: { variant: "default", label: "En Tránsito" },
      completado: { variant: "success", label: "Completado" },
      cancelado: { variant: "admin", label: "Cancelado" },
    };

    return estados[estado] || { variant: "secondary", label: estado };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Detalle de Orden de Salida
          </DialogTitle>
          <DialogDescription>
            Información completa de la orden de salida
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
              <div className="text-right">
                {(() => {
                  const estadoConfig = getEstadoBadge(orden.estado);
                  return (
                    <Badge variant={estadoConfig.variant} className="text-base">
                      {estadoConfig.label}
                    </Badge>
                  );
                })()}
              </div>
            </div>

            <Separator />

            {/* Información General */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Store className="h-4 w-4" />
                Información General
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Semillera</p>
                  <p className="font-medium">{orden.semillera?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Semilla</p>
                  <Badge variant="secondary" className="uppercase">
                    {orden.semilla?.nombre}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{orden.cliente?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de Salida
                  </p>
                  <p className="font-medium">
                    {formatDate(orden.fecha_salida)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Transporte */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <TruckIcon className="h-4 w-4" />
                Información de Transporte
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Conductor</p>
                  <p className="font-medium">{orden.conductor?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehículo</p>
                  <p className="font-medium font-mono">
                    {orden.vehiculo?.placa} - {orden.vehiculo?.marca_modelo}
                  </p>
                </div>
                {orden.deposito && (
                  <div>
                    <p className="text-sm text-muted-foreground">Depósito</p>
                    <p className="font-medium">{orden.deposito}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Detalles de los Lotes */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Package className="h-4 w-4" />
                Detalle de Lotes
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lote</TableHead>
                      <TableHead>Variedad</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Presentación</TableHead>
                      <TableHead className="text-right">Unidades</TableHead>
                      <TableHead className="text-right">Kg/Unidad</TableHead>
                      <TableHead className="text-right">Total Kg</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orden.detalles.map((detalle) => (
                      <TableRow key={detalle.id_detalle_salida}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {detalle.nro_lote}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {detalle.variedad?.nombre}
                        </TableCell>
                        <TableCell>
                          <Badge>{detalle.categoria?.nombre}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {detalle.tamano || "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {detalle.cantidad_unidades}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {detalle.kg_por_unidad}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {detalle.total_kg}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totales */}
              <div className="mt-4 flex justify-end gap-8 text-sm border-t pt-4">
                <div>
                  <span className="text-muted-foreground">Total Bolsas:</span>
                  <span className="ml-2 font-semibold">
                    {orden.detalles.reduce(
                      (sum, d) => sum + d.cantidad_unidades,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Kg:</span>
                  <span className="ml-2 font-semibold font-mono">
                    {orden.detalles.reduce((sum, d) => sum + Number(d.total_kg), 0).toFixed(2)}
                  </span>
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
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    {orden.observaciones}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Información de Auditoría */}
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p>Creado por: {orden.usuario_creador?.nombre}</p>
                <p>Fecha: {formatDate(orden.fecha_creacion)}</p>
              </div>
              <div className="text-right">
                <p>Unidad: {orden.unidad?.nombre}</p>
              </div>
            </div>
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
