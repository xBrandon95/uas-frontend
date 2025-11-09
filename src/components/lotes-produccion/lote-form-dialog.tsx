"use client";

import { useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCreateLoteProduccion,
  useLoteProduccion,
  useUpdateLoteProduccion,
  useLotesByOrdenIngreso,
} from "@/hooks/use-lotes-produccion";
import { useOrdenIngreso } from "@/hooks/use-ordenes-ingreso";
import { useCategoriasActivas } from "@/hooks/use-categorias";

const loteSchema = z.object({
  id_categoria_salida: z.number({ message: "Requerido" }),
  cantidad_unidades: z.number().min(1, "Mínimo 1 unidad"),
  kg_por_unidad: z.number().min(0.01, "Mínimo 0.01 kg"),
  presentacion: z.string().min(1, "Seleccione una presentación"),
  tipo_servicio: z.string().optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

const PRESENTACIONES = [
  { value: "bolsas", label: "Bolsas" },
  { value: "latas", label: "Latas" },
  { value: "baldes", label: "Baldes" },
] as const;

interface LoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenId: number;
  loteId?: number | null;
}

export function LoteFormDialog({
  open,
  onOpenChange,
  ordenId,
  loteId,
}: LoteFormDialogProps) {
  const isEditing = !!loteId;

  const createMutation = useCreateLoteProduccion();
  const updateMutation = useUpdateLoteProduccion();
  const { data: lote, isLoading: isLoadingLote } = useLoteProduccion(loteId);
  const { data: orden } = useOrdenIngreso(ordenId);
  const { data: lotesExistentes } = useLotesByOrdenIngreso(ordenId);
  const { data: categorias } = useCategoriasActivas();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      id_categoria_salida: undefined,
      cantidad_unidades: undefined,
      kg_por_unidad: undefined,
      presentacion: "",
      tipo_servicio: "",
    },
    mode: "onChange",
  });

  const cantidadUnidades = watch("cantidad_unidades") || 0;
  const kgPorUnidad = watch("kg_por_unidad") || 0;
  const presentacionSeleccionada = watch("presentacion");
  const categoriaSeleccionada = watch("id_categoria_salida");

  // Calcular total kg
  const totalKg = useMemo(
    () => cantidadUnidades * kgPorUnidad,
    [cantidadUnidades, kgPorUnidad]
  );

  // Calcular disponibilidad
  const pesoNetoOrden = orden?.peso_neto || 0;
  const totalProducido = useMemo(() => {
    if (!lotesExistentes) return 0;
    return lotesExistentes.reduce(
      (sum, l) => sum + Number(l.total_kg_original),
      0
    );
  }, [lotesExistentes]);

  const pesoDisponible = useMemo(
    () => pesoNetoOrden - totalProducido,
    [pesoNetoOrden, totalProducido]
  );

  const excedePeso = useMemo(
    () => !isEditing && totalKg > pesoDisponible,
    [isEditing, totalKg, pesoDisponible]
  );

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingLote;

  // Reset al abrir el diálogo o cambiar de modo
  useEffect(() => {
    if (open) {
      if (isEditing && lote && !isLoadingLote) {
        // Modo edición: cargar datos del lote
        const timer = setTimeout(() => {
          reset({
            id_categoria_salida: lote.id_categoria_salida,
            cantidad_unidades: lote.cantidad_unidades,
            kg_por_unidad: Number(lote.kg_por_unidad),
            presentacion: lote.presentacion,
            tipo_servicio: lote.tipo_servicio || "",
          });
        }, 100);
        return () => clearTimeout(timer);
      } else if (!isEditing) {
        // Modo creación: limpiar formulario
        reset({
          id_categoria_salida: undefined,
          cantidad_unidades: undefined,
          kg_por_unidad: undefined,
          presentacion: "",
          tipo_servicio: "",
        });
      }
    }
  }, [open, isEditing, lote, isLoadingLote, reset]);

  const onSubmit = async (data: LoteFormData) => {
    if (!orden) return;

    const submitData = {
      ...data,
      id_orden_ingreso: ordenId,
      id_unidad: orden.id_unidad,
      id_variedad: orden.id_variedad,
      estado: "disponible" as const,
    };

    if (!isEditing && excedePeso) return;

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: loteId,
          dto: submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }

      // Cerrar diálogo
      onOpenChange(false);

      // Reset con valores limpios después de cerrar
      setTimeout(() => {
        reset({
          id_categoria_salida: undefined,
          cantidad_unidades: undefined,
          kg_por_unidad: undefined,
          presentacion: "",
          tipo_servicio: "",
        });
      }, 300);
    } catch (error) {
      // Error manejado por el hook
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        // Reset inmediato al cerrar
        if (!isOpen) {
          setTimeout(() => {
            reset({
              id_categoria_salida: undefined,
              cantidad_unidades: undefined,
              kg_por_unidad: undefined,
              presentacion: "",
              tipo_servicio: "",
            });
          }, 200);
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Lote" : "Nuevo Lote de Producción"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del lote"
              : `Crear lote desde la orden ${orden?.numero_orden}`}
          </DialogDescription>
        </DialogHeader>

        {isLoadingLote && isEditing ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando datos del lote...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Resumen de disponibilidad */}
            {!isEditing && (
              <Alert className="border-blue-200 bg-blue-50/50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <p className="font-semibold text-blue-900 mb-2">
                    Disponibilidad de la Orden
                  </p>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Semilla</p>
                      <p className="font-bold text-indigo-600">
                        {orden?.semilla?.nombre || "N/A"} -{" "}
                        {orden?.variedad?.nombre || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Peso Neto</p>
                      <p className="font-bold text-blue-900">
                        {pesoNetoOrden} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Producido</p>
                      <p className="font-bold text-orange-600">
                        {totalProducido.toFixed(2)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Disponible
                      </p>
                      <p className="font-bold text-green-600">
                        {pesoDisponible.toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Presentación y Categoría */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="presentacion">
                  Presentación <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={presentacionSeleccionada || ""}
                  onValueChange={(value) => setValue("presentacion", value)}
                >
                  <SelectTrigger
                    className={cn(
                      errors.presentacion && "border-red-500",
                      "w-full"
                    )}
                  >
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESENTACIONES.map((pres) => (
                      <SelectItem key={pres.value} value={pres.value}>
                        {pres.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.presentacion && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.presentacion.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="id_categoria_salida">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={categoriaSeleccionada?.toString() || ""}
                  onValueChange={(value) =>
                    setValue("id_categoria_salida", Number(value))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      errors.id_categoria_salida && "border-red-500",
                      "w-full"
                    )}
                  >
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias?.map((categoria) => (
                      <SelectItem
                        key={categoria.id_categoria}
                        value={categoria.id_categoria.toString()}
                      >
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_categoria_salida && (
                  <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                )}
              </div>
            </div>

            {/* Cantidades */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cantidad_unidades">
                  Unidades <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidad_unidades"
                  type="number"
                  min="1"
                  {...register("cantidad_unidades", { valueAsNumber: true })}
                  className={errors.cantidad_unidades ? "border-red-500" : ""}
                />
                {errors.cantidad_unidades && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.cantidad_unidades.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="kg_por_unidad">
                  Kg/Unidad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kg_por_unidad"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("kg_por_unidad", { valueAsNumber: true })}
                  className={errors.kg_por_unidad ? "border-red-500" : ""}
                />
                {errors.kg_por_unidad && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.kg_por_unidad.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Total Kg</Label>
                <div className="h-10 px-3 flex items-center rounded-md border bg-muted">
                  <Badge
                    variant={excedePeso ? "destructive" : "default"}
                    className="font-mono text-base w-full justify-center"
                  >
                    {totalKg.toFixed(2)} kg
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tipo de Servicio */}
            <div>
              <Label htmlFor="tipo_servicio">Tipo de Servicio</Label>
              <Input
                id="tipo_servicio"
                {...register("tipo_servicio")}
                placeholder="Ej: Tratamiento Premium (opcional)"
              />
            </div>

            {/* Alerta de exceso */}
            {excedePeso && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold">
                    ⚠️ El total excede el peso disponible
                  </p>
                  <p className="text-sm mt-1">
                    Peso del lote: <strong>{totalKg.toFixed(2)} kg</strong> |
                    Disponible: <strong>{pesoDisponible.toFixed(2)} kg</strong>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || excedePeso}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Actualizar" : "Crear"} Lote
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
