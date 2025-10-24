"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FolderOpen, Loader2 } from "lucide-react";
import { useCategoria } from "@/hooks/use-categorias";

interface CategoriaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId: number | null;
}

export function CategoriaDetailDialog({
  open,
  onOpenChange,
  categoriaId,
}: CategoriaDetailDialogProps) {
  const { data: categoria, isLoading } = useCategoria(categoriaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalle de la Categoría
          </DialogTitle>
          <DialogDescription>
            Información completa de la categoría
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando detalles...
            </span>
          </div>
        ) : categoria ? (
          <div className="space-y-6">
            <Separator />

            {/* Información principal */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                </div>
                <p className="text-base font-semibold">{categoria.nombre}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos de la categoría
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
