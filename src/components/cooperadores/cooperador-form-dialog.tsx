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
  useCreateCooperador,
  useCooperador,
  useUpdateCooperador,
} from "@/hooks/use-cooperadores";

interface CooperadorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadorId?: number | null;
}

const cooperadorSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  ci: z
    .string()
    .min(5, "El CI debe tener al menos 5 caracteres")
    .max(50, "El CI no puede exceder 50 caracteres")
    .regex(
      /^[0-9]+[A-Z]?$/,
      "El CI debe contener solo números y opcionalmente una letra al final"
    ),
  telefono: z
    .string()
    .max(50, "El teléfono no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
});

type CooperadorFormData = z.infer<typeof cooperadorSchema>;

export function CooperadorFormDialog({
  open,
  onOpenChange,
  cooperadorId,
}: CooperadorFormDialogProps) {
  const isEditing = !!cooperadorId;
  const createMutation = useCreateCooperador();
  const updateMutation = useUpdateCooperador();

  const { data: cooperador, isLoading: isLoadingCooperador } = useCooperador(
    isEditing ? cooperadorId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CooperadorFormData>({
    resolver: zodResolver(cooperadorSchema),
    defaultValues: {
      nombre: "",
      ci: "",
      telefono: "",
    },
  });

  useEffect(() => {
    if (isEditing && cooperador) {
      reset({
        nombre: cooperador.nombre,
        ci: cooperador.ci,
        telefono: cooperador.telefono || "",
      });
    } else if (!isEditing) {
      reset({
        nombre: "",
        ci: "",
        telefono: "",
      });
    }
  }, [isEditing, cooperador, reset]);

  const onSubmit = async (data: CooperadorFormData) => {
    const submitData = {
      ...data,
      telefono: data.telefono === "" ? undefined : data.telefono,
    };

    if (isEditing && cooperadorId) {
      await updateMutation.mutateAsync({
        id: cooperadorId,
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
            {isEditing ? "Editar Cooperador" : "Nuevo Cooperador"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del cooperador"
              : "Ingresa los datos del nuevo cooperador"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingCooperador ? (
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
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ci">
                Carnet de Identidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ci"
                {...register("ci")}
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
                placeholder="(opcional)"
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
