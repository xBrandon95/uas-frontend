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
import { User, Shield, Building2, Activity, Loader2 } from "lucide-react";
import { useUsuario } from "@/hooks/use-usuarios";
import { Role } from "@/types";

interface UsuarioDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number | null;
}

const getRoleBadge = (rol: string) => {
  const variants = {
    admin: { variant: "admin" as const, label: "Administrador" },
    encargado: { variant: "encargado" as const, label: "Encargado" },
    operador: { variant: "operador" as const, label: "Operador" },
  };

  const config = variants[rol as keyof typeof variants] || {
    variant: "secondary" as const,
    label: rol,
  };

  return (
    <Badge variant={config.variant} className="h-8">
      <Shield className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export function UsuarioDetailDialog({
  open,
  onOpenChange,
  usuarioId,
}: UsuarioDetailDialogProps) {
  const { data: usuario, isLoading } = useUsuario(usuarioId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalle del Usuario
          </DialogTitle>
          <DialogDescription>
            Información completa del usuario del sistema
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : usuario ? (
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
                <p className="text-base font-semibold">{usuario.nombre}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre de Usuario
                  </p>
                </div>
                <p className="text-base font-mono font-semibold">
                  {usuario.usuario}
                </p>
              </div>

              {usuario.unidad && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Unidad Asignada
                    </p>
                  </div>
                  <p className="text-base font-semibold">
                    {usuario.unidad.nombre}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {getRoleBadge(usuario.rol)}
                <Badge
                  variant={usuario.activo ? "success" : "secondary"}
                  className="h-8"
                >
                  <Activity className="mr-1 h-3 w-3" />
                  {usuario.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              {usuario.rol === Role.ADMIN && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Este usuario tiene permisos de{" "}
                    <strong>Administrador</strong> y puede acceder a todas las
                    unidades del sistema.
                  </p>
                </div>
              )}
            </div>

            <Separator />
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del usuario
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
