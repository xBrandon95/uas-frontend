"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  useCreateServicio,
  useServicio,
  useUpdateServicio,
} from "@/hooks/use-servicios";

const servicioSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  activo: z.boolean().default(true),
});

type ServicioFormData = z.infer<typeof servicioSchema>;

interface ServicioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicioId?: number | null;
  onCreated?: ((id: number) => void) | null;
}

export function ServicioFormDialog({
  open,
  onOpenChange,
  servicioId,
  onCreated,
}: ServicioFormDialogProps) {
  const isEditing = !!servicioId;
  const createMutation = useCreateServicio();
  const updateMutation = useUpdateServicio();

  const { data: servicio, isLoading: isLoadingServicio } =
    useServicio(servicioId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (isEditing && servicio) {
      reset({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || "",
        activo: servicio.activo,
      });
    } else if (!isEditing) {
      reset({
        nombre: "",
        descripcion: "",
        activo: true,
      });
    }
  }, [isEditing, servicio, reset]);

  const onSubmit = async (data: ServicioFormData) => {
    try {
      if (isEditing && servicioId) {
        await updateMutation.mutateAsync({
          id: servicioId,
          dto: data,
        });
      } else {
        const newServicio = await createMutation.mutateAsync(data);
        if (onCreated && newServicio) {
          onCreated(newServicio.id_servicio);
        }
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error ya manejado por el hook
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingServicio;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setTimeout(() => reset(), 200);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del servicio"
              : "Ingresa los datos del nuevo servicio"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingServicio && isEditing ? (
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
                placeholder="Ej: Tratamiento Premium"
                className={errors.nombre ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register("descripcion")}
                placeholder="Descripción del servicio (opcional)"
                rows={3}
                className={errors.descripcion ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">
                  {errors.descripcion.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Máximo 500 caracteres
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                {...register("activo")}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Servicio activo
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
