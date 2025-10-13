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
  useCreateUnidad,
  useUnidad,
  useUpdateUnidad,
} from "@/hooks/use-unidades";

interface UnidadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId?: number | null;
}

const unidadSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  ubicacion: z.string().optional(),
  activo: z.boolean(),
});

type UnidadFormData = z.infer<typeof unidadSchema>;

export function UnidadFormDialog({
  open,
  onOpenChange,
  unidadId,
}: UnidadFormDialogProps) {
  const isEditing = !!unidadId;
  const createMutation = useCreateUnidad();
  const updateMutation = useUpdateUnidad();

  const { data: unidad, isLoading: isLoadingUnidad } = useUnidad(
    isEditing ? unidadId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnidadFormData>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      nombre: "",
      ubicacion: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (isEditing && unidad) {
      reset({
        nombre: unidad.nombre,
        ubicacion: unidad.ubicacion,
        activo: unidad.activo,
      });
    } else if (!isEditing) {
      reset({
        nombre: "",
        ubicacion: "",
        activo: true,
      });
    }
  }, [isEditing, unidad, reset]);

  const onSubmit = async (data: UnidadFormData) => {
    if (isEditing && unidadId) {
      await updateMutation.mutateAsync({
        id: unidadId,
        dto: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Unidad" : "Nueva Unidad"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información de la unidad"
              : "Ingresa los datos de la nueva unidad"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingUnidad ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando datos...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Unidad Acondicionadora"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                {...register("ubicacion")}
                placeholder="Ubicación de la unidad (opcional)"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.ubicacion && (
                <p className="text-sm text-red-500">
                  {errors.ubicacion.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                {...register("activo")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Unidad activa
              </Label>
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
