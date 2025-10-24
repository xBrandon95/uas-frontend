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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useCreateVariedad,
  useVariedad,
  useUpdateVariedad,
} from "@/hooks/use-variedades";
import { useSemillasActivas } from "@/hooks/use-semillas";
import { cn } from "@/lib/utils";

interface VariedadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variedadId?: number | null;
}

const variedadSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  id_semilla: z.number().min(1, "Debe seleccionar una semilla"),
});

type VariedadFormData = z.infer<typeof variedadSchema>;

export function VariedadFormDialog({
  open,
  onOpenChange,
  variedadId,
}: VariedadFormDialogProps) {
  const isEditing = !!variedadId;
  const createMutation = useCreateVariedad();
  const updateMutation = useUpdateVariedad();

  const { data: variedad, isLoading: isLoadingVariedad } = useVariedad(
    isEditing ? variedadId : null
  );
  const { data: semillas, isLoading: isLoadingSemillas } = useSemillasActivas();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VariedadFormData>({
    resolver: zodResolver(variedadSchema),
    defaultValues: {
      nombre: "",
      id_semilla: undefined,
    },
  });

  const selectedSemillaId = watch("id_semilla");

  useEffect(() => {
    if (open) {
      if (isEditing && variedad) {
        setTimeout(() => {
          reset({
            nombre: variedad.nombre,
            id_semilla: variedad.id_semilla,
          });
        }, 0);
      } else if (!isEditing) {
        reset({
          nombre: "",
          id_semilla: undefined,
        });
      }
    }
  }, [open, isEditing, variedad, reset]);

  const onSubmit = async (data: VariedadFormData) => {
    if (isEditing && variedadId) {
      await updateMutation.mutateAsync({
        id: variedadId,
        dto: data,
      });
      onOpenChange(false);
      return;
    }

    await createMutation.mutateAsync(data);
    onOpenChange(false);
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    isLoadingVariedad ||
    isLoadingSemillas;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Variedad" : "Nueva Variedad"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información de la variedad"
              : "Ingresa los datos de la nueva variedad"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingVariedad || isLoadingSemillas ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando datos...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id_semilla">
                Semilla <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedSemillaId?.toString()}
                onValueChange={(value) => setValue("id_semilla", Number(value))}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.id_semilla && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Selecciona una semilla" />
                </SelectTrigger>
                <SelectContent>
                  {semillas?.map((semilla) => (
                    <SelectItem
                      key={semilla.id_semilla}
                      value={semilla.id_semilla.toString()}
                    >
                      {semilla.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_semilla && (
                <p className="text-sm text-red-500">
                  {errors.id_semilla.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre de la Variedad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Variedad Premium"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
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
