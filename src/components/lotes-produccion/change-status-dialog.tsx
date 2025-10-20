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
import { useCambiarEstadoLote } from "@/hooks/use-lotes-produccion";
import { LoteProduccion } from "@/types";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote: LoteProduccion | null;
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  lote,
}: ChangeStatusDialogProps) {
  const [nuevoEstado, setNuevoEstado] = useState("");
  const cambiarEstadoMutation = useCambiarEstadoLote();

  const handleChangeStatus = async () => {
    if (!lote || !nuevoEstado) return;
    await cambiarEstadoMutation.mutateAsync({
      id: lote.id_lote_produccion,
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
          <DialogTitle>Cambiar Estado del Lote</DialogTitle>
          <DialogDescription>
            Actualiza el estado del lote {lote?.nro_lote}
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
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="parcialmente_vendido">
                  Parcialmente Vendido
                </SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="descartado">Descartado</SelectItem>
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
