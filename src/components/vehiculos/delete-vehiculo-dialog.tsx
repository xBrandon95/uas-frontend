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
import { useDeleteVehiculo } from "@/hooks/use-vehiculos";
import { Vehiculo } from "@/types";

interface DeleteVehiculoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiculo: Vehiculo | null;
}

export function DeleteVehiculoDialog({
  open,
  onOpenChange,
  vehiculo,
}: DeleteVehiculoDialogProps) {
  const deleteMutation = useDeleteVehiculo();

  const handleDelete = async () => {
    if (!vehiculo) return;
    await deleteMutation.mutateAsync(vehiculo.id_vehiculo);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente el vehículo con placa{" "}
            <strong>{vehiculo?.placa}</strong>
            {vehiculo?.marca_modelo && <> {vehiculo.marca_modelo} </>}. Esta
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
