// src/components/lotes-produccion/lote-produccion-form-dialog.tsx
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
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle, Info, Package, Wheat } from "lucide-react";
import { OrdenIngreso } from "@/types";
import {
  useCreateLoteProduccion,
  useLotesByOrdenIngreso,
} from "@/hooks/use-lotes-produccion";
import { useCategoriasActivas } from "@/hooks/use-categorias";
import { cn } from "@/lib/utils";

interface LoteProduccionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenIngreso: OrdenIngreso | null;
}

const PRESENTACIONES = [
  { value: "bolsas", label: "Bolsas" },
  { value: "latas", label: "Latas" },
  { value: "baldes", label: "Baldes" },
] as const;

const UNIDAD_LABELS: Record<string, { plural: string; singular: string }> = {
  bolsas: { plural: "Bolsas", singular: "Bolsa" },
  latas: { plural: "Latas", singular: "Lata" },
  baldes: { plural: "Baldes", singular: "Balde" },
};

const getUnidadLabel = (presentacion: string, singular = false) => {
  const unidad = UNIDAD_LABELS[presentacion];
  if (!unidad) return singular ? "Unidad" : "Unidades";
  return singular ? unidad.singular : unidad.plural;
};

const loteSchema = z.object({
  id_categoria_salida: z.number({ message: "Requerido" }),
  cantidad_unidades: z.number().min(1, "Mínimo 1 unidad"),
  kg_por_unidad: z.number().min(0.01, "Mínimo 0.01 kg"),
  presentacion: z.string().min(1, "Seleccione una presentación"),
  tipo_servicio: z.string().optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

export function LoteProduccionFormDialog({
  open,
  onOpenChange,
  ordenIngreso,
}: LoteProduccionFormDialogProps) {
  const createMutation = useCreateLoteProduccion();
  const { data: categorias } = useCategoriasActivas();
  const { data: lotesExistentes } = useLotesByOrdenIngreso(
    ordenIngreso?.id_orden_ingreso || null
  );

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
      presentacion: "",
    },
  });

  const cantidadUnidades = watch("cantidad_unidades") || 0;
  const kgPorUnidad = watch("kg_por_unidad") || 0;
  const presentacionSeleccionada = watch("presentacion");
  const categoriaSeleccionada = watch("id_categoria_salida");

  // Calcular peso total
  const totalKg = useMemo(
    () => cantidadUnidades * kgPorUnidad,
    [cantidadUnidades, kgPorUnidad]
  );

  // Calcular disponibilidad
  const pesoNetoOrden = ordenIngreso?.peso_neto || 0;
  const totalProducido = useMemo(() => {
    if (!lotesExistentes) return 0;
    return lotesExistentes.reduce((sum, l) => sum + Number(l.total_kg), 0);
  }, [lotesExistentes]);

  const pesoDisponible = useMemo(
    () => pesoNetoOrden - totalProducido,
    [pesoNetoOrden, totalProducido]
  );

  const excedePeso = useMemo(
    () => totalKg > pesoDisponible,
    [totalKg, pesoDisponible]
  );

  // Auto-completar categoría cuando se abre el modal
  useEffect(() => {
    if (open && ordenIngreso && categorias && !categoriaSeleccionada) {
      const { id_categoria_ingreso } = ordenIngreso;
      if (id_categoria_ingreso) {
        const categoriaExiste = categorias.some(
          (c) => c.id_categoria === id_categoria_ingreso
        );
        if (categoriaExiste) {
          setValue("id_categoria_salida", id_categoria_ingreso, {
            shouldValidate: true,
          });
        }
      }
    }
  }, [open, ordenIngreso, categorias, categoriaSeleccionada, setValue]);

  // Resetear form al cerrar
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: LoteFormData) => {
    if (!ordenIngreso || excedePeso) return;

    const submitData = {
      id_orden_ingreso: ordenIngreso.id_orden_ingreso,
      id_variedad: ordenIngreso.id_variedad,
      id_unidad: ordenIngreso.id_unidad,
      id_categoria_salida: data.id_categoria_salida,
      cantidad_unidades: data.cantidad_unidades,
      kg_por_unidad: data.kg_por_unidad,
      presentacion: data.presentacion,
      tipo_servicio: data.tipo_servicio || "",
      estado: "disponible" as const,
    };

    try {
      await createMutation.mutateAsync(submitData);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error manejado por el hook
    }
  };

  const isLoading = createMutation.isPending;

  if (!ordenIngreso) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Crear Lote de Producción
          </DialogTitle>
          <DialogDescription>
            Crear lote desde la orden{" "}
            <Badge variant="outline" className="font-mono">
              {ordenIngreso.numero_orden}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Resumen de Disponibilidad */}
          <Alert className="border-blue-200 bg-blue-50/50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <p className="font-semibold text-blue-900 mb-2">
                Disponibilidad de Peso
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Peso Neto</p>
                  <p className="text-lg font-bold text-blue-900">
                    {pesoNetoOrden} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Producido</p>
                  <p className="text-lg font-bold text-orange-600">
                    {totalProducido.toFixed(2)} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Disponible</p>
                  <p className="text-lg font-bold text-green-600">
                    {pesoDisponible.toFixed(2)} kg
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* <Separator /> */}

          {/* Información de la Orden (Solo Lectura) */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wheat className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Información de la Orden</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Semilla</p>
                <p className="font-medium">{ordenIngreso.semilla?.nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Variedad</p>
                <p className="font-medium">{ordenIngreso.variedad?.nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Categoría Ingreso</p>
                <Badge variant="secondary">
                  {ordenIngreso.categoria_ingreso?.nombre}
                </Badge>
              </div>
            </div>
          </div>
          {/* <Separator /> */}

          {/* Formulario de Datos del Lote */}
          <div className="space-y-4">
            <h3 className="font-semibold">Datos del Nuevo Lote</h3>

            {/* Presentación y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Categoría de Salida <span className="text-red-500">*</span>
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

              {/* Tipo de Servicio */}
              <div>
                <Label htmlFor="tipo_servicio">Tipo de Servicio</Label>
                <Input id="tipo_servicio" {...register("tipo_servicio")} />
              </div>
            </div>

            {/* Cantidades */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cantidad_unidades">
                  {presentacionSeleccionada
                    ? `Número de ${getUnidadLabel(presentacionSeleccionada)}`
                    : "Número de Unidades"}{" "}
                  <span className="text-red-500">*</span>
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
                  {presentacionSeleccionada
                    ? `Kg por ${getUnidadLabel(presentacionSeleccionada, true)}`
                    : "Kg por Unidad"}{" "}
                  <span className="text-red-500">*</span>
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
                <Label>Total Kg (calculado)</Label>
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
                    Disponible: <strong>{pesoDisponible.toFixed(2)} kg</strong>{" "}
                    | Exceso:{" "}
                    <strong className="text-red-700">
                      {(totalKg - pesoDisponible).toFixed(2)} kg
                    </strong>
                  </p>
                  <p className="text-xs mt-1">
                    Ajusta el número de{" "}
                    {presentacionSeleccionada
                      ? getUnidadLabel(presentacionSeleccionada).toLowerCase()
                      : "unidades"}{" "}
                    o los kg por{" "}
                    {presentacionSeleccionada
                      ? getUnidadLabel(
                          presentacionSeleccionada,
                          true
                        ).toLowerCase()
                      : "unidad"}
                    .
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Botones */}
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
              <Package className="mr-2 h-4 w-4" />
              Crear Lote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
