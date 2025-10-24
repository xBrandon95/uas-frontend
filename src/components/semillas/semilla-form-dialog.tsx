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
  useCreateSemilla,
  useSemilla,
  useUpdateSemilla,
} from "@/hooks/use-semillas";

interface SemillaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semillaId?: number | null;
}

const semillaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  activo: z.boolean(),
});

type SemillaFormData = z.infer<typeof semillaSchema>;

export function SemillaFormDialog({
  open,
  onOpenChange,
  semillaId,
}: SemillaFormDialogProps) {
  const isEditing = !!semillaId;
  const createMutation = useCreateSemilla();
  const updateMutation = useUpdateSemilla();

  const { data: semilla, isLoading: isLoadingSemilla } = useSemilla(
    isEditing ? semillaId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemillaFormData>({
    resolver: zodResolver(semillaSchema),
    defaultValues: {
      nombre: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditing && semilla) {
        reset({
          nombre: semilla.nombre,
          activo: semilla.activo,
        });
      } else if (!isEditing) {
        reset({
          nombre: "",
          activo: true,
        });
      }
    }
  }, [open, isEditing, semilla, reset]);

  const onSubmit = async (data: SemillaFormData) => {
    if (isEditing && semillaId) {
      await updateMutation.mutateAsync({
        id: semillaId,
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
            {isEditing ? "Editar Semilla" : "Nueva Semilla"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información de la semilla"
              : "Ingresa los datos de la nueva semilla"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingSemilla ? (
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
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
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
                Semilla activa
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
