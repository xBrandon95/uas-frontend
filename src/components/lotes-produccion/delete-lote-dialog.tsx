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
import { useDeleteLoteProduccion } from "@/hooks/use-lotes-produccion";
import { LoteProduccion } from "@/types";

interface DeleteLoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote: LoteProduccion | null;
}

export function DeleteLoteDialog({
  open,
  onOpenChange,
  lote,
}: DeleteLoteDialogProps) {
  const deleteMutation = useDeleteLoteProduccion();

  const handleDelete = async () => {
    if (!lote) return;
    await deleteMutation.mutateAsync(lote.id_lote_produccion);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente el lote{" "}
            <strong>{lote?.nro_lote}</strong> (
            {lote?.total_kg ? `${Number(lote.total_kg).toFixed(2)} kg` : "0 kg"}
            ). Esta acción no se puede deshacer.
            {lote?.estado === "vendido" && (
              <span className="block mt-2 text-red-600 font-semibold">
                No se puede eliminar un lote vendido.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending || lote?.estado === "vendido"}
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
