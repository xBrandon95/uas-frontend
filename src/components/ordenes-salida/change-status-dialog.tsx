"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCambiarEstadoOrdenSalida } from "@/hooks/use-ordenes-salida";
import { OrdenSalida } from "@/types";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orden: OrdenSalida | null;
}

const estados = [
  {
    value: "pendiente",
    label: "Pendiente",
    description: "Orden registrada, pendiente de despacho",
  },
  {
    value: "en_transito",
    label: "En Tránsito",
    description: "Orden despachada y en camino",
  },
  {
    value: "completado",
    label: "Completado",
    description: "Orden entregada exitosamente",
  },
  { value: "cancelado", label: "Cancelado", description: "Orden cancelada" },
];

export function ChangeStatusDialog({
  open,
  onOpenChange,
  orden,
}: ChangeStatusDialogProps) {
  const [nuevoEstado, setNuevoEstado] = useState("");
  const cambiarEstadoMutation = useCambiarEstadoOrdenSalida();

  const handleChangeStatus = async () => {
    if (!orden || !nuevoEstado) return;
    await cambiarEstadoMutation.mutateAsync({
      id: orden.id_orden_salida,
      estado: nuevoEstado,
    });
    onOpenChange(false);
    setNuevoEstado("");
  };

  const getEstadoBadge = (estado: string) => {
    const configs: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pendiente: { variant: "secondary" },
      en_transito: { variant: "default" },
      completado: { variant: "outline" },
      cancelado: { variant: "destructive" },
    };
    return configs[estado] || { variant: "secondary" };
  };

  const estadoSeleccionado = estados.find((e) => e.value === nuevoEstado);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setNuevoEstado("");
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Orden de Salida</DialogTitle>
          <DialogDescription>
            Actualiza el estado de la orden {orden?.numero_orden}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Estado Actual */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-2">Estado Actual</p>
            {orden &&
              (() => {
                const config = getEstadoBadge(orden.estado);
                return (
                  <Badge variant={config.variant} className="text-base">
                    {estados.find((e) => e.value === orden.estado)?.label ||
                      orden.estado}
                  </Badge>
                );
              })()}
          </div>

          {/* Nuevo Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Nuevo Estado</Label>
            <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => {
                  const config = getEstadoBadge(estado.value);
                  return (
                    <SelectItem key={estado.value} value={estado.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant} className="text-xs">
                          {estado.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Descripción del estado seleccionado */}
            {estadoSeleccionado && (
              <p className="text-sm text-muted-foreground">
                {estadoSeleccionado.description}
              </p>
            )}
          </div>

          {/* Advertencia para estado completado */}
          {nuevoEstado === "completado" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atención:</strong> Una vez marcada como "Completado", no
                podrás editar ni eliminar esta orden.
              </AlertDescription>
            </Alert>
          )}

          {/* Advertencia para estado cancelado */}
          {nuevoEstado === "cancelado" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Advertencia:</strong> Al cancelar la orden, se revertirá
                el inventario de los lotes asociados.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cambiarEstadoMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangeStatus}
            disabled={!nuevoEstado || cambiarEstadoMutation.isPending}
          >
            {cambiarEstadoMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Actualizar Estado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
