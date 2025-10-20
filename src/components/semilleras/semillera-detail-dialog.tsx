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
import { Store, MapPin, Phone, Activity, Loader2 } from "lucide-react";
import { useSemillera } from "@/hooks/use-semilleras";

interface SemilleraDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semilleraId: number | null;
}

export function SemilleraDetailDialog({
  open,
  onOpenChange,
  semilleraId,
}: SemilleraDetailDialogProps) {
  const { data: semillera, isLoading } = useSemillera(semilleraId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Detalle de la Semillera
          </DialogTitle>
          <DialogDescription>
            Información completa de la semillera
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : semillera ? (
          <div className="space-y-6">

            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                </div>
                <p className="text-lg font-semibold">{semillera.nombre}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                </div>
                {semillera.direccion ? (
                  <p className="text-base font-semibold">
                    {semillera.direccion}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin dirección registrada
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                </div>
                {semillera.telefono ? (
                  <p className="text-base font-semibold font-mono">
                    {semillera.telefono}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin teléfono registrado
                  </p>
                )}
              </div>
            </div>

            <Separator />
            {/* Estado */}
            <div className="flex items-center justify-between">
              {/* <div>
                <p className="text-sm text-muted-foreground">
                  ID de la Semillera
                </p>
                <p className="text-xl font-bold">{semillera.id_semillera}</p>
              </div> */}
              <Badge
                variant={semillera.activo ? "success" : "secondary"}
                className="h-8"
              >
                <Activity className="mr-1 h-3 w-3" />
                {semillera.activo ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>

        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la semillera
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
