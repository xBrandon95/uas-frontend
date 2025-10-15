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
import { Sprout, Wheat, Loader2 } from "lucide-react";
import { useVariedad } from "@/hooks/use-variedades";

interface VariedadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variedadId: number | null;
}

export function VariedadDetailDialog({
  open,
  onOpenChange,
  variedadId,
}: VariedadDetailDialogProps) {
  const { data: variedad, isLoading } = useVariedad(variedadId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            Detalle de la Variedad
          </DialogTitle>
          <DialogDescription>
            Información completa de la variedad
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : variedad ? (
          <div className="space-y-6">
            {/* ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  ID de la Variedad
                </p>
                <p className="text-xl font-bold">{variedad.id_variedad}</p>
              </div>
            </div>

            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre de la Variedad
                  </p>
                </div>
                <p className="text-lg font-semibold">{variedad.nombre}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wheat className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Semilla Asociada
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base">
                    {variedad.semilla?.nombre || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la variedad
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
