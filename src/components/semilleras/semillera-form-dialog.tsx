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
  useCreateSemillera,
  useSemillera,
  useUpdateSemillera,
} from "@/hooks/use-semilleras";

interface SemilleraFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semilleraId?: number | null;
}

const semilleraSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  direccion: z
    .string()
    .max(300, "La dirección no puede exceder 300 caracteres")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .max(50, "El teléfono no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  activo: z.boolean(),
});

type SemilleraFormData = z.infer<typeof semilleraSchema>;

export function SemilleraFormDialog({
  open,
  onOpenChange,
  semilleraId,
}: SemilleraFormDialogProps) {
  const isEditing = !!semilleraId;
  const createMutation = useCreateSemillera();
  const updateMutation = useUpdateSemillera();

  const { data: semillera, isLoading: isLoadingSemillera } = useSemillera(
    isEditing ? semilleraId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemilleraFormData>({
    resolver: zodResolver(semilleraSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (isEditing && semillera) {
      reset({
        nombre: semillera.nombre,
        direccion: semillera.direccion || "",
        telefono: semillera.telefono || "",
        activo: semillera.activo,
      });
    } else if (!isEditing) {
      reset({
        nombre: "",
        direccion: "",
        telefono: "",
        activo: true,
      });
    }
  }, [isEditing, semillera, reset]);

  const onSubmit = async (data: SemilleraFormData) => {
    const submitData = {
      ...data,
      direccion: data.direccion || undefined,
      telefono: data.telefono || undefined,
    };

    if (isEditing && semilleraId) {
      await updateMutation.mutateAsync({
        id: semilleraId,
        dto: submitData,
      });
      onOpenChange(false);
      return;
    }

    await createMutation.mutateAsync(submitData);
    onOpenChange(false);
    reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Semillera" : "Nueva Semillera"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información de la semillera"
              : "Ingresa los datos de la nueva semillera"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingSemillera ? (
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
                placeholder="Ej: Semillera San José"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                {...register("direccion")}
                placeholder="Ej: Av. Principal #123"
                className={errors.direccion ? "border-red-500" : ""}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">
                  {errors.direccion.message}
                </p>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                {...register("activo")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Semillera activa
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
