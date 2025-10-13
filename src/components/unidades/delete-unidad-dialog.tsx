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
import { useDeleteUnidad } from "@/hooks/use-unidades";
import { Unidad } from "@/types";

interface DeleteUnidadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidad: Unidad | null;
}

export function DeleteUnidadDialog({
  open,
  onOpenChange,
  unidad,
}: DeleteUnidadDialogProps) {
  const deleteMutation = useDeleteUnidad();

  const handleDelete = async () => {
    if (!unidad) return;
    await deleteMutation.mutateAsync(unidad.id_unidad);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente la <strong>{unidad?.nombre}</strong>.
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
