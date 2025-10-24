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
  useCreateUsuario,
  useUsuario,
  useUpdateUsuario,
} from "@/hooks/use-usuarios";
import { useAllUnidades } from "@/hooks/use-unidades";
import { CreateUsuarioDto, Role, UpdateUsuarioDto } from "@/types";
import { cn } from "@/lib/utils";

interface UsuarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId?: number | null;
}

const createUsuarioSchema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    usuario: z
      .string()
      .min(4, "El usuario debe tener al menos 4 caracteres")
      .max(50, "El usuario no puede exceder 50 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    rol: z.nativeEnum(Role),
    id_unidad: z.number().optional().nullable(),
    activo: z.boolean(),
  })
  .refine(
    (data) => {
      // Si el rol no es ADMIN, id_unidad es requerido
      if (data.rol !== Role.ADMIN) {
        return data.id_unidad !== undefined && data.id_unidad !== null;
      }
      return true;
    },
    {
      message: "La unidad es requerida para este rol",
      path: ["id_unidad"],
    }
  );

const updateUsuarioSchema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    usuario: z
      .string()
      .min(4, "El usuario debe tener al menos 4 caracteres")
      .max(50, "El usuario no puede exceder 50 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .optional()
      .or(z.literal("")),
    rol: z.nativeEnum(Role),
    id_unidad: z.number().optional().nullable(),
    activo: z.boolean(),
  })
  .refine(
    (data) => {
      // Si el rol no es ADMIN, id_unidad es requerido
      if (data.rol !== Role.ADMIN) {
        return data.id_unidad !== undefined && data.id_unidad !== null;
      }
      return true;
    },
    {
      message: "La unidad es requerida para este rol",
      path: ["id_unidad"],
    }
  );

type UsuarioFormData =
  | z.infer<typeof createUsuarioSchema>
  | z.infer<typeof updateUsuarioSchema>;

export function UsuarioFormDialog({
  open,
  onOpenChange,
  usuarioId,
}: UsuarioFormDialogProps) {
  const isEditing = !!usuarioId;
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();

  const { data: usuario, isLoading: isLoadingUsuario } = useUsuario(
    isEditing ? usuarioId : null
  );

  const { data: unidades } = useAllUnidades();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(
      isEditing ? updateUsuarioSchema : createUsuarioSchema
    ),
    defaultValues: {
      nombre: "",
      usuario: "",
      password: "",
      rol: Role.OPERADOR,
      id_unidad: undefined,
      activo: true,
    },
  });

  const rolSeleccionado = watch("rol");
  const esAdminEditando = isEditing && usuario?.rol === Role.ADMIN;

  useEffect(() => {
    if (open) {
      if (isEditing && usuario) {
        setTimeout(() => {
          reset({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            password: "",
            rol: usuario.rol as Role,
            id_unidad: usuario.id_unidad || undefined,
            activo: usuario.activo,
          });
        }, 0);
      } else if (!isEditing) {
        reset({
          nombre: "",
          usuario: "",
          password: "",
          rol: Role.OPERADOR,
          id_unidad: undefined,
          activo: true,
        });
      }
    }
  }, [open, isEditing, usuario, reset]);

  // Si cambia el rol a admin, limpiar unidad
  useEffect(() => {
    if (rolSeleccionado === Role.ADMIN) {
      setValue("id_unidad", undefined);
    }
  }, [rolSeleccionado, setValue]);

  const onSubmit = async (data: UsuarioFormData) => {
    const base = {
      nombre: data.nombre,
      usuario: data.usuario,
      rol: data.rol,
      activo: data.activo,
      ...(data.rol !== Role.ADMIN && data.id_unidad
        ? { id_unidad: data.id_unidad }
        : {}),
    };

    if (isEditing && usuarioId) {
      const dto: UpdateUsuarioDto = {
        ...base,
        ...(data.password?.trim() ? { password: data.password } : {}),
      };

      await updateMutation.mutateAsync({ id: usuarioId, dto });
    } else {
      if (!data.password?.trim()) return;

      const dto: CreateUsuarioDto = {
        ...base,
        password: data.password,
      };

      await createMutation.mutateAsync(dto);
    }

    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del usuario"
              : "Ingresa los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingUsuario ? (
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
                placeholder="Ej: Juan Pérez"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario">
                Nombre de Usuario <span className="text-red-500">*</span>
              </Label>
              <Input
                id="usuario"
                {...register("usuario")}
                placeholder="Ej: jperez"
                className={errors.usuario ? "border-red-500" : ""}
              />
              {errors.usuario && (
                <p className="text-sm text-red-500">{errors.usuario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña{" "}
                {!isEditing && <span className="text-red-500">*</span>}
                {isEditing && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (dejar en blanco para mantener la actual)
                  </span>
                )}
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder={
                  isEditing
                    ? "Nueva contraseña (opcional)"
                    : "Mínimo 6 caracteres"
                }
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">
                Rol <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("rol")}
                onValueChange={(value) => {
                  setValue("rol", value as Role, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                disabled={esAdminEditando}
              >
                <SelectTrigger
                  className={cn("w-full", errors.rol && "border-red-500")}
                >
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {!isEditing && (
                    <>
                      <SelectItem value={Role.ENCARGADO}>Encargado</SelectItem>
                      <SelectItem value={Role.OPERADOR}>Operador</SelectItem>
                    </>
                  )}
                  {isEditing && (
                    <>
                      {usuario?.rol === Role.ADMIN && (
                        <SelectItem value={Role.ADMIN}>
                          Administrador
                        </SelectItem>
                      )}
                      {usuario?.rol !== Role.ADMIN && (
                        <>
                          <SelectItem value={Role.ENCARGADO}>
                            Encargado
                          </SelectItem>
                          <SelectItem value={Role.OPERADOR}>
                            Operador
                          </SelectItem>
                        </>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              {esAdminEditando && (
                <p className="text-sm text-muted-foreground">
                  No se puede cambiar el rol de un administrador
                </p>
              )}
              {errors.rol && (
                <p className="text-sm text-red-500">{errors.rol.message}</p>
              )}
            </div>

            {rolSeleccionado !== Role.ADMIN && (
              <div className="space-y-2">
                <Label htmlFor="id_unidad">
                  Unidad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("id_unidad")?.toString() || ""}
                  onValueChange={(value) => {
                    const newValue = value ? parseInt(value) : undefined;
                    setValue("id_unidad", newValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.id_unidad && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Selecciona una unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades?.map((unidad) => (
                      <SelectItem
                        key={unidad.id_unidad}
                        value={unidad.id_unidad.toString()}
                      >
                        {unidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_unidad && (
                  <p className="text-sm text-red-500">
                    {errors.id_unidad.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                {...register("activo")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Usuario activo
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
