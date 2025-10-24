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
import { MapPin, Building2, Activity, Loader2 } from "lucide-react";
import { useUnidad } from "@/hooks/use-unidades";

interface UnidadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: number | null;
}

export function UnidadDetailDialog({
  open,
  onOpenChange,
  unidadId,
}: UnidadDetailDialogProps) {
  const { data: unidad, isLoading } = useUnidad(unidadId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-3">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Detalle de la Unidad
              </DialogTitle>
              <DialogDescription>
                Información completa de la unidad acondicionadora
              </DialogDescription>
            </div>
            {unidad && (
              <Badge
                variant={unidad.activo ? "success" : "secondary"}
                className="h-7"
              >
                <Activity className="mr-1 h-3 w-3" />
                {unidad.activo ? "Activo" : "Inactiva"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : unidad ? (
          <div className="space-y-6">
            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                </div>
                <p className="text-base font-semibold">{unidad.nombre}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Ubicación
                  </p>
                </div>
                <p className="text-base">
                  {unidad.ubicacion || (
                    <span className="text-muted-foreground italic">
                      Sin ubicación especificada
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la unidad
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
