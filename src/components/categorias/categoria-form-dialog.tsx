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
  useCreateCategoria,
  useCategoria,
  useUpdateCategoria,
} from "@/hooks/use-categorias";

interface CategoriaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId?: number | null;
}

const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

export function CategoriaFormDialog({
  open,
  onOpenChange,
  categoriaId,
}: CategoriaFormDialogProps) {
  const isEditing = !!categoriaId;
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();

  const { data: categoria, isLoading: isLoadingCategoria } = useCategoria(
    isEditing ? categoriaId : null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
    },
  });

  useEffect(() => {
    if (isEditing && categoria) {
      reset({
        nombre: categoria.nombre,
      });
    } else if (!isEditing) {
      reset({
        nombre: "",
      });
    }
  }, [isEditing, categoria, reset]);

  const onSubmit = async (data: CategoriaFormData) => {
    if (isEditing && categoriaId) {
      await updateMutation.mutateAsync({
        id: categoriaId,
        dto: data,
      });
      onOpenChange(false);
      return;
    }

    await createMutation.mutateAsync(data);
    onOpenChange(false);
    reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información de la categoría"
              : "Ingresa los datos de la nueva categoría"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingCategoria ? (
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
                Nombre de la Categoría <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Certificada"
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
