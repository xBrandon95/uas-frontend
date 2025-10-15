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
import { useDeleteSemilla } from "@/hooks/use-semillas";
import { Semilla } from "@/types";

interface DeleteSemillaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semilla: Semilla | null;
}

export function DeleteSemillaDialog({
  open,
  onOpenChange,
  semilla,
}: DeleteSemillaDialogProps) {
  const deleteMutation = useDeleteSemilla();

  const handleDelete = async () => {
    if (!semilla) return;
    await deleteMutation.mutateAsync(semilla.id_semilla);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente la semilla{" "}
            <strong>{semilla?.nombre}</strong>. Esta acción no se puede
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
