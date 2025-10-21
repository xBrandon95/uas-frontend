"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Phone, MapPin, Loader2 } from "lucide-react";
import { useCliente } from "@/hooks/use-clientes";

interface ClienteDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: number | null;
}

export function ClienteDetailDialog({
  open,
  onOpenChange,
  clienteId,
}: ClienteDetailDialogProps) {
  const { data: cliente, isLoading } = useCliente(clienteId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalle del Cliente
          </DialogTitle>
          <DialogDescription>
            Información completa del cliente
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : cliente ? (
          <div className="space-y-6">
            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                </div>
                <p className="text-lg font-semibold">{cliente.nombre}</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    NIT
                  </p>
                </div>
                {cliente.nit ? (
                  <p className="text-lg font-semibold font-mono">
                    {cliente.nit}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin NIT registrado
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
                {cliente.telefono ? (
                  <p className="text-lg font-semibold font-mono">
                    {cliente.telefono}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin teléfono registrado
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                </div>
                {cliente.direccion ? (
                  <p className="text-base">{cliente.direccion}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin dirección registrada
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del cliente
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
