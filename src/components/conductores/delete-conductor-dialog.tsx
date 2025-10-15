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
import { useDeleteConductor } from "@/hooks/use-conductores";
import { Conductor } from "@/types";

interface DeleteConductorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductor: Conductor | null;
}

export function DeleteConductorDialog({
  open,
  onOpenChange,
  conductor,
}: DeleteConductorDialogProps) {
  const deleteMutation = useDeleteConductor();

  const handleDelete = async () => {
    if (!conductor) return;
    await deleteMutation.mutateAsync(conductor.id_conductor);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente al conductor{" "}
            <strong>{conductor?.nombre}</strong> (CI: {conductor?.ci}). Esta
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
