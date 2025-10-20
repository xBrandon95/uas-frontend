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
import { useCooperador } from "@/hooks/use-cooperadores";

interface CooperadorDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadorId: number | null;
}

export function CooperadorDetailDialog({
  open,
  onOpenChange,
  cooperadorId,
}: CooperadorDetailDialogProps) {
  const { data: cooperador, isLoading } = useCooperador(cooperadorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalle del Cooperador
          </DialogTitle>
          <DialogDescription>
            Información completa del cooperador
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : cooperador ? (
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
                <p className="text-base font-semibold">{cooperador.nombre}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Carnet de Identidad
                  </p>
                </div>
                <p className="text-base font-semibold">{cooperador.ci}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                </div>
                <p className="text-base font-semibold">
                  {cooperador.telefono || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del cooperador
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
