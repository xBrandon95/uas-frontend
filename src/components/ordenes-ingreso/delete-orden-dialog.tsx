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
import { Loader2 } from "lucide-react";
import { useDeleteOrdenIngreso } from "@/hooks/use-ordenes-ingreso";
import { OrdenIngreso } from "@/types";

interface DeleteOrdenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orden: OrdenIngreso | null;
}

export function DeleteOrdenDialog({
  open,
  onOpenChange,
  orden,
}: DeleteOrdenDialogProps) {
  const deleteMutation = useDeleteOrdenIngreso();

  const handleDelete = async () => {
    if (!orden) return;
    await deleteMutation.mutateAsync(orden.id_orden_ingreso);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente la orden de ingreso{" "}
            <strong>{orden?.numero_orden}</strong>. Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
