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
import { Wheat, Activity, Loader2 } from "lucide-react";
import { useSemilla } from "@/hooks/use-semillas";

interface SemillaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semillaId: number | null;
}

export function SemillaDetailDialog({
  open,
  onOpenChange,
  semillaId,
}: SemillaDetailDialogProps) {
  const { data: semilla, isLoading } = useSemilla(semillaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Detalle de la Semilla
          </DialogTitle>
          <DialogDescription>
            Información completa de la semilla
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : semilla ? (
          <div className="space-y-6">

            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wheat className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre de la Semilla
                  </p>
                </div>
                <p className="text-lg font-semibold">{semilla.nombre}</p>
              </div>
            </div>

            <Separator />
            {/* ID y Estado */}
            <div className="flex items-center justify-between">
              {/* <div>
                <p className="text-sm text-muted-foreground">
                  ID de la Semilla
                </p>
                <p className="text-xl font-bold">{semilla.id_semilla}</p>
              </div> */}
              <Badge
                variant={semilla.activo ? "success" : "secondary"}
                className="h-8"
              >
                <Activity className="mr-1 h-3 w-3" />
                {semilla.activo ? "Activo" : "Inactiva"}
              </Badge>
            </div>

          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la semilla
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
