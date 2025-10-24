"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useCreateVehiculo,
  useVehiculo,
  useUpdateVehiculo,
} from "@/hooks/use-vehiculos";

interface VehiculoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiculoId?: number | null;
}

const vehiculoSchema = z.object({
  marca_modelo: z
    .string()
    .min(3, "El vehiculo debe tener al menos 2 caracteres")
    .max(100, "Vehículo no puede exceder 100 caracteres"),
  placa: z
    .string()
    .min(3, "La placa debe tener al menos 6 caracteres")
    .max(20, "La placa no puede exceder 20 caracteres")
    .transform((val) => val.toUpperCase()),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

export function VehiculoFormDialog({
  open,
  onOpenChange,
  vehiculoId,
}: VehiculoFormDialogProps) {
  const isEditing = !!vehiculoId;
  const createMutation = useCreateVehiculo();
  const updateMutation = useUpdateVehiculo();

  const { data: vehiculo, isLoading: isLoadingVehiculo } = useVehiculo(
    isEditing ? vehiculoId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      placa: "",
      marca_modelo: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditing && vehiculo) {
        reset({
          placa: vehiculo.placa,
          marca_modelo: vehiculo.marca_modelo,
        });
      } else if (!isEditing) {
        reset({
          placa: "",
          marca_modelo: "",
        });
      }
    }
  }, [open, isEditing, vehiculo, reset]);

  const onSubmit = async (data: VehiculoFormData) => {
    if (isEditing && vehiculoId) {
      await updateMutation.mutateAsync({
        id: vehiculoId,
        dto: data,
      });
      onOpenChange(false);
      return;
    }

    await createMutation.mutateAsync(data);
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del vehículo"
              : "Ingresa los datos del nuevo vehículo"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingVehiculo ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando datos...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Vehículo</Label>
              <Input
                id="marca"
                {...register("marca_modelo")}
                placeholder="Marca/Modelo"
                className={errors.marca_modelo ? "border-red-500" : ""}
              />
              {errors.marca_modelo && (
                <p className="text-sm text-red-500">
                  {errors.marca_modelo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="placa">
                Placa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="placa"
                {...register("placa")}
                placeholder="123XYZ"
                className={errors.placa ? "border-red-500" : ""}
                style={{ textTransform: "uppercase" }}
              />
              {errors.placa && (
                <p className="text-sm text-red-500">{errors.placa.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
