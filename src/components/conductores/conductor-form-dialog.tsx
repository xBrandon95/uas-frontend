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
  useCreateConductor,
  useConductor,
  useUpdateConductor,
} from "@/hooks/use-conductores";

interface ConductorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductorId?: number | null;
  onCreated?: ((id: number) => void) | null;
}

const conductorSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  ci: z
    .string()
    .min(5, "El CI debe tener al menos 5 caracteres")
    .max(50, "El CI no puede exceder 50 caracteres"),
  telefono: z
    .string()
    .max(50, "El teléfono no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
});

type ConductorFormData = z.infer<typeof conductorSchema>;

export function ConductorFormDialog({
  open,
  onOpenChange,
  conductorId,
  onCreated,
}: ConductorFormDialogProps) {
  const isEditing = !!conductorId;
  const createMutation = useCreateConductor();
  const updateMutation = useUpdateConductor();

  const { data: conductor, isLoading: isLoadingConductor } = useConductor(
    isEditing ? conductorId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConductorFormData>({
    resolver: zodResolver(conductorSchema),
    defaultValues: {
      nombre: "",
      ci: "",
      telefono: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditing && conductor) {
        reset({
          nombre: conductor.nombre,
          ci: conductor.ci,
          telefono: conductor.telefono || "",
        });
      } else if (!isEditing) {
        reset({
          nombre: "",
          ci: "",
          telefono: "",
        });
      }
    }
  }, [open, isEditing, conductor, reset]);

  const onSubmit = async (data: ConductorFormData) => {
    const submitData = {
      ...data,
      telefono: data.telefono || undefined,
    };

    if (isEditing && conductorId) {
      await updateMutation.mutateAsync({
        id: conductorId,
        dto: submitData,
      });
      onOpenChange(false);
      return;
    }

    const result = await createMutation.mutateAsync(submitData);

    if (onCreated && result?.id_conductor) {
      onCreated(result.id_conductor);
    }

    onOpenChange(false);
    reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Conductor" : "Nuevo Conductor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del conductor"
              : "Ingresa los datos del nuevo conductor"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingConductor ? (
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
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Juan Pérez García"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ci">
                CI (Cédula de Identidad) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ci"
                {...register("ci")}
                placeholder="Ej: 1234567 LP"
                className={errors.ci ? "border-red-500" : ""}
              />
              {errors.ci && (
                <p className="text-sm text-red-500">{errors.ci.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register("telefono")}
                placeholder="Ej: 77123456"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">
                  {errors.telefono.message}
                </p>
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
