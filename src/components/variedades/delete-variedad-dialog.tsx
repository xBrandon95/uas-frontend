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
import { useDeleteVariedad } from "@/hooks/use-variedades";
import { Variedad } from "@/types";

interface DeleteVariedadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variedad: Variedad | null;
}

export function DeleteVariedadDialog({
  open,
  onOpenChange,
  variedad,
}: DeleteVariedadDialogProps) {
  const deleteMutation = useDeleteVariedad();

  const handleDelete = async () => {
    if (!variedad) return;
    await deleteMutation.mutateAsync(variedad.id_variedad);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente la variedad{" "}
            <strong>{variedad?.nombre}</strong> de la semilla{" "}
            <strong>{variedad?.semilla?.nombre}</strong>. Esta acción no se
            puede deshacer.
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
