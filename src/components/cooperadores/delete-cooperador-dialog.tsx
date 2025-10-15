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
import { useDeleteCooperador } from "@/hooks/use-cooperadores";
import { Cooperador } from "@/types";

interface DeleteCooperadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperador: Cooperador | null;
}

export function DeleteCooperadorDialog({
  open,
  onOpenChange,
  cooperador,
}: DeleteCooperadorDialogProps) {
  const deleteMutation = useDeleteCooperador();

  const handleDelete = async () => {
    if (!cooperador) return;
    await deleteMutation.mutateAsync(cooperador.id_cooperador);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente al cooperador{" "}
            <strong>{cooperador?.nombre}</strong> (CI: {cooperador?.ci}). Esta
            acción no se puede deshacer.
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
