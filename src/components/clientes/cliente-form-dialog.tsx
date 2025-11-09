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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  useCreateCliente,
  useCliente,
  useUpdateCliente,
} from "@/hooks/use-clientes";

interface ClienteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId?: number | null;
  onCreated?: ((id: number) => void) | null;
}

const clienteSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  nit: z
    .string()
    .max(50, "El NIT no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .max(50, "El teléfono no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .max(300, "La dirección no puede exceder 300 caracteres")
    .optional()
    .or(z.literal("")),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export function ClienteFormDialog({
  open,
  onOpenChange,
  clienteId,
  onCreated,
}: ClienteFormDialogProps) {
  const isEditing = !!clienteId;
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();

  const { data: cliente, isLoading: isLoadingCliente } = useCliente(
    isEditing ? clienteId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      nit: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEditing && cliente) {
        reset({
          nombre: cliente.nombre,
          nit: cliente.nit || "",
          telefono: cliente.telefono || "",
          direccion: cliente.direccion || "",
        });
      } else if (!isEditing) {
        reset({
          nombre: "",
          nit: "",
          telefono: "",
          direccion: "",
        });
      }
    }
  }, [open, isEditing, cliente, reset]);

  const onSubmit = async (data: ClienteFormData) => {
    const submitData = {
      ...data,
      nit: data.nit || undefined,
      telefono: data.telefono || undefined,
      direccion: data.direccion || undefined,
    };

    if (isEditing && clienteId) {
      await updateMutation.mutateAsync({
        id: clienteId,
        dto: submitData,
      });
      onOpenChange(false);
      return;
    }

    const result = await createMutation.mutateAsync(submitData);

    if (onCreated && result?.id_cliente) {
      onCreated(result.id_cliente);
    }

    onOpenChange(false);
    reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del cliente"
              : "Ingresa los datos del nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingCliente ? (
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
                placeholder="Ej: Juan Pérez García"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nit">NIT/CI</Label>
              <Input
                id="nit"
                {...register("nit")}
                placeholder="Ej: 1234567890"
                className={errors.nit ? "border-red-500" : ""}
              />
              {errors.nit && (
                <p className="text-sm text-red-500">{errors.nit.message}</p>
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

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                {...register("direccion")}
                placeholder="Ej: Av. Principal #123, Zona Norte"
                rows={3}
                className={errors.direccion ? "border-red-500" : ""}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">
                  {errors.direccion.message}
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
