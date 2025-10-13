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
  CalendarDays,
  MapPin,
  Building2,
  Activity,
  Loader2,
} from "lucide-react";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Detalle de la Unidad
          </DialogTitle>
          <DialogDescription>
            Información completa de la unidad acondicionadora
          </DialogDescription>
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
            {/* ID y Estado */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ID de la Unidad</p>
                <p className="text-xl font-bold">{unidad.id_unidad}</p>
              </div>
              <Badge
                variant={unidad.activo ? "default" : "secondary"}
                className="h-8"
              >
                <Activity className="mr-1 h-3 w-3" />
                {unidad.activo ? "Activa" : "Inactiva"}
              </Badge>
            </div>

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
                <p className="text-base font-semibold">{unidad.ubicacion}</p>
              </div>
            </div>

            <Separator />

            {/* Fechas */}
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Creación
                    </p>
                    <p className="text-sm font-semibold mt-1 capitalize">
                      {formatDate(unidad.fecha_creacion)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Última Actualización
                    </p>
                    <p className="text-sm font-semibold mt-1 capitalize">
                      {formatDate(unidad.fecha_actualizacion)}
                    </p>
                  </div>
                </div>
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
