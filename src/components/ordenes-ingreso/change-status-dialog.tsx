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
import { Loader2 } from "lucide-react";
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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setNuevoEstado("");
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Estado</DialogTitle>
          <DialogDescription>
            Actualiza el estado de la orden {orden?.numero_orden}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="estado">Nuevo Estado</Label>
            <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
