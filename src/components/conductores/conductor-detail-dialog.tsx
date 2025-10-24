"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Phone, Loader2 } from "lucide-react";
import { useConductor } from "@/hooks/use-conductores";

interface ConductorDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductorId: number | null;
}

export function ConductorDetailDialog({
  open,
  onOpenChange,
  conductorId,
}: ConductorDetailDialogProps) {
  const { data: conductor, isLoading } = useConductor(conductorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalle del Conductor
          </DialogTitle>
          <DialogDescription>
            Información completa del conductor
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : conductor ? (
          <div className="space-y-6">
            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </p>
                </div>
                <p className="text-base font-semibold">{conductor.nombre}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Cédula de Identidad
                  </p>
                </div>
                <p className="text-base font-semibold font-mono">
                  {conductor.ci}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                </div>
                <p className="text-base font-mono">
                  {conductor.telefono || (
                    <span className="text-muted-foreground font-sans">
                      Sin teléfono registrado
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del conductor
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
