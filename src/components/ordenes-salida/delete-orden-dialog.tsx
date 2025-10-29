"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { useDeleteOrdenSalida } from "@/hooks/use-ordenes-salida";
import { OrdenSalida } from "@/types";

interface DeleteOrdenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orden: OrdenSalida | null;
}

export function DeleteOrdenDialog({
  open,
  onOpenChange,
  orden,
}: DeleteOrdenDialogProps) {
  const deleteMutation = useDeleteOrdenSalida();

  const handleDelete = async () => {
    if (!orden) return;
    await deleteMutation.mutateAsync(orden.id_orden_salida);
    onOpenChange(false);
  };

  const totalUnidades =
    orden?.detalles.reduce((sum, d) => sum + d.cantidad_unidades, 0) || 0;
  const totalKg = orden?.detalles.reduce((sum, d) => sum + d.total_kg, 0) || 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Se eliminará permanentemente la orden de salida{" "}
              <strong className="font-mono">{orden?.numero_orden}</strong>.
            </p>

            {orden?.estado === "completado" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800">
                <p className="font-semibold text-sm">
                  ⚠️ No se puede eliminar una orden completada
                </p>
              </div>
            )}

            {orden?.estado !== "completado" && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Detalles de la orden:
                  </p>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      • Cliente: <strong>{orden?.cliente?.nombre}</strong>
                    </p>
                    <p>
                      • Semillera: <strong>{orden?.semillera?.nombre}</strong>
                    </p>
                    <p>
                      • Semilla: <strong>{orden?.semilla?.nombre}</strong>
                    </p>
                    <p>
                      • Total Unidades: <strong>{totalUnidades}</strong>
                    </p>
                    <p>
                      • Total kg: <strong>{totalKg.toFixed(2)}</strong>
                    </p>
                    <p>
                      • Lotes asociados:{" "}
                      <strong>{orden?.detalles.length}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Al eliminar esta orden, se restaurará
                    el inventario de los lotes asociados.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer.
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={
              deleteMutation.isPending || orden?.estado === "completado"
            }
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar Orden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
