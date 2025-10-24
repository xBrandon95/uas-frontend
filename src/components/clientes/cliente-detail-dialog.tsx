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
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                </div>
                <p className="text-base font-semibold">{cliente.nombre}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    NIT/CI
                  </p>
                </div>
                <p className="text-base font-mono">
                  {cliente.nit || (
                    <span className="text-muted-foreground italic font-sans">
                      Sin NIT registrado
                    </span>
                  )}
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
                  {cliente.telefono || (
                    <span className="text-muted-foreground italic font-sans">
                      Sin teléfono registrado
                    </span>
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                </div>
                <p className="text-base">
                  {cliente.direccion || (
                    <span className="text-muted-foreground">
                      Sin dirección registrada
                    </span>
                  )}
                </p>
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
