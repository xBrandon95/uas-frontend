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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Lock } from "lucide-react";
import { useCambiarEstadoOrdenIngreso } from "@/hooks/use-ordenes-ingreso";
import { OrdenIngreso } from "@/types";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orden: OrdenIngreso | null;
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  orden,
}: ChangeStatusDialogProps) {
  const [nuevoEstado, setNuevoEstado] = useState("");
  const cambiarEstadoMutation = useCambiarEstadoOrdenIngreso();

  const handleChangeStatus = async () => {
    if (!orden || !nuevoEstado) return;
    await cambiarEstadoMutation.mutateAsync({
      id: orden.id_orden_ingreso,
      estado: nuevoEstado,
    });
    onOpenChange(false);
    setNuevoEstado("");
  };

  // Verificar si la orden ya está en estado final
  const esEstadoFinal =
    orden?.estado === "completado" || orden?.estado === "cancelado";

  const getEstadoBadge = (estado: string) => {
    const configs: Record<
      string,
      { variant: "default" | "success" | "admin" | "pending" }
    > = {
      pendiente: { variant: "pending" },
      en_proceso: { variant: "default" },
      completado: { variant: "success" },
      cancelado: { variant: "admin" },
    };

    return configs[estado] || { variant: "secondary" };
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
      cancelado: "Cancelado",
    };
    return labels[estado] || estado;
  };

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
          <DialogTitle className="flex items-center gap-2">
            {esEstadoFinal && <Lock className="h-5 w-5 text-amber-600" />}
            Cambiar Estado de Orden
          </DialogTitle>
          <DialogDescription>
            Actualiza el estado de la orden {orden?.numero_orden}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Estado Actual */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-2">Estado Actual</p>
            {orden && (
              <div className="flex items-center gap-2">
                {(() => {
                  const config = getEstadoBadge(orden.estado);
                  return (
                    <Badge variant={config.variant} className="text-base">
                      {getEstadoLabel(orden.estado)}
                    </Badge>
                  );
                })()}
                {esEstadoFinal && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Lock className="h-3 w-3" />
                    Estado Final
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Mensaje de bloqueo si ya está en estado final */}
          {esEstadoFinal ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Estado Bloqueado:</strong> Las órdenes marcadas como
                Completado o Cancelado no pueden cambiar de estado. Esta acción
                es irreversible.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Selector de Nuevo Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Nuevo Estado</Label>
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado final" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completado">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Completado
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Finaliza la orden
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelado">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          Cancelado
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Anula la orden
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advertencia para estado completado */}
              {nuevoEstado === "completado" && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <strong>Atención:</strong> Al marcar como Completado, la
                    orden quedará bloqueada permanentemente. No podrás editarla
                    ni cambiar su estado posteriormente.
                  </AlertDescription>
                </Alert>
              )}

              {/* Advertencia para estado cancelado */}
              {nuevoEstado === "cancelado" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Advertencia:</strong> Al cancelar la orden:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>No se podrán crear más lotes de producción</li>
                      <li>El estado quedará bloqueado permanentemente</li>
                      <li>Solo puedes cancelar si no tiene lotes asociados</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <p className="font-semibold mb-1">ℹ️ Importante</p>
                <p className="text-xs">
                  Los estados Pendiente y En Proceso se actualizan
                  automáticamente según la creación de lotes. Solo puedes
                  cambiar manualmente a estados finales.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cambiarEstadoMutation.isPending}
          >
            {esEstadoFinal ? "Cerrar" : "Cancelar"}
          </Button>
          {!esEstadoFinal && (
            <Button
              onClick={handleChangeStatus}
              disabled={!nuevoEstado || cambiarEstadoMutation.isPending}
              variant={nuevoEstado === "cancelado" ? "destructive" : "default"}
            >
              {cambiarEstadoMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar Cambio
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
