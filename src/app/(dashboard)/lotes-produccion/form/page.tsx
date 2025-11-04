"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ArrowLeft, Loader2, Save, Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  useCreateLoteProduccion,
  useLoteProduccion,
  useUpdateLoteProduccion,
  useLotesByOrdenIngreso,
} from "@/hooks/use-lotes-produccion";
import {
  useOrdenesDisponiblesParaLotes,
  useOrdenIngreso,
} from "@/hooks/use-ordenes-ingreso";
import { useCategoriasActivas } from "@/hooks/use-categorias";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const loteSchema = z.object({
  id_orden_ingreso: z.number({ message: "Requerido" }),
  id_categoria_salida: z.number({ message: "Requerido" }),
  cantidad_unidades: z.number().min(1, "Mínimo 1 unidad"),
  kg_por_unidad: z.number().min(0.01, "Mínimo 0.01 kg"),
  presentacion: z.string().min(1, "Seleccione una presentación"),
  tipo_servicio: z.string().optional(),
  id_variedad: z.number().optional(),
  id_unidad: z.number().optional(),
  estado: z.string().optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

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

export default function LoteProduccionFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loteId = searchParams.get("id");
  const isEditing = !!loteId;

  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);

  const createMutation = useCreateLoteProduccion();
  const updateMutation = useUpdateLoteProduccion();
  const { data: lote, isLoading: isLoadingLote } = useLoteProduccion(
    isEditing ? Number(loteId) : null
  );

  const { data: ordenes } = useOrdenesDisponiblesParaLotes();
  const { data: ordenSeleccionada } = useOrdenIngreso(selectedOrdenId);
  const { data: lotesExistentes } = useLotesByOrdenIngreso(selectedOrdenId);
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
      estado: "disponible",
      presentacion: "",
    },
  });

  const cantidadUnidades = watch("cantidad_unidades") || 0;
  const kgPorUnidad = watch("kg_por_unidad") || 0;
  const presentacionSeleccionada = watch("presentacion");
  const categoriaSeleccionada = watch("id_categoria_salida");

  // Cálculos memoizados
  const totalKg = useMemo(
    () => cantidadUnidades * kgPorUnidad,
    [cantidadUnidades, kgPorUnidad]
  );

  const pesoNetoOrden = ordenSeleccionada?.peso_neto || 0;

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

  // Limpiar formulario al montar si no estamos editando
  useEffect(() => {
    if (!isEditing) {
      setSelectedOrdenId(null);
      reset({
        estado: "disponible",
        presentacion: "",
      });
    }
  }, [isEditing, reset]);

  // Auto-completar categoría cuando se carga la orden
  useEffect(() => {
    if (!ordenSeleccionada || isEditing || !categorias || categoriaSeleccionada)
      return;

    const { id_categoria_ingreso } = ordenSeleccionada;
    if (!id_categoria_ingreso) return;

    const categoriaExiste = categorias.some(
      (c) => c.id_categoria === id_categoria_ingreso
    );

    if (categoriaExiste) {
      setValue("id_categoria_salida", id_categoria_ingreso, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [
    ordenSeleccionada,
    isEditing,
    categorias,
    categoriaSeleccionada,
    setValue,
  ]);

  // Cargar datos al editar
  useEffect(() => {
    if (isEditing && lote) {
      setSelectedOrdenId(lote.id_orden_ingreso);
      reset({
        id_orden_ingreso: lote.id_orden_ingreso,
        id_categoria_salida: lote.id_categoria_salida,
        cantidad_unidades: lote.cantidad_unidades,
        kg_por_unidad: Number(lote.kg_por_unidad),
        presentacion: lote.presentacion || "",
        tipo_servicio: lote.tipo_servicio,
        id_unidad: lote.id_unidad,
        estado: lote.estado,
      });
    }
  }, [isEditing, lote, reset]);

  const handleOrdenChange = useCallback(
    (value: string) => {
      const id = Number(value);
      setSelectedOrdenId(id);
      setValue("id_orden_ingreso", id);
      setValue("id_categoria_salida", undefined as any);
    },
    [setValue]
  );

  const onSubmit = async (data: LoteFormData) => {
    if (!ordenSeleccionada) return;

    const submitData = {
      ...data,
      id_unidad: ordenSeleccionada.id_unidad,
      id_variedad: ordenSeleccionada.id_variedad,
      estado: "disponible" as const,
    };

    if (!isEditing && excedePeso) return;

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: Number(loteId),
          dto: submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      router.push("/lotes-produccion");
    } catch (error) {
      // Error manejado por el hook
    }
  };

  const handleBack = () => router.push("/lotes-produccion");

  if (isLoadingLote && isEditing) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Editar Lote de Producción" : "Nuevo Lote de Producción"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditing
            ? "Modifica la información del lote"
            : "Crea un nuevo lote desde una orden de ingreso"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Paso 1: Selección de Orden */}
        {!isEditing && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Paso 1: Seleccionar Orden de Ingreso
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="id_orden_ingreso">
                  Orden de Ingreso <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedOrdenId?.toString() || ""}
                  onValueChange={handleOrdenChange}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.id_orden_ingreso && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Seleccionar orden de ingreso" />
                  </SelectTrigger>
                  <SelectContent>
                    {ordenes?.map((orden) => (
                      <SelectItem
                        key={orden.id_orden_ingreso}
                        value={orden.id_orden_ingreso.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {orden.numero_orden}
                          </Badge>
                          <span>
                            {orden.semilla?.nombre} - {orden.variedad?.nombre} -{" "}
                            {orden.peso_neto} kg
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_orden_ingreso && (
                  <p className="text-sm text-red-500 mt-1">
                    Debe seleccionar una orden de ingreso
                  </p>
                )}
              </div>

              {/* Resumen de la Orden */}
              {ordenSeleccionada && (
                <Alert className="border-blue-200 bg-blue-50/50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <p className="font-semibold text-blue-900 mb-3">
                      Resumen de la Orden de Ingreso
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Peso Neto Orden
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {pesoNetoOrden} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ya Producido
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          {totalProducido} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Disponible
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {pesoDisponible} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Lotes Creados
                        </p>
                        <p className="text-lg font-bold">
                          {lotesExistentes?.length || 0}
                        </p>
                      </div>
                    </div>
                    {lotesExistentes && lotesExistentes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-2">
                          Lotes existentes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lotesExistentes.map((l) => (
                            <Badge
                              key={l.id_lote_produccion}
                              variant="secondary"
                              className="text-xs"
                            >
                              {l.nro_lote}: {l.cantidad_unidades} ×{" "}
                              {l.kg_por_unidad}kg = {Number(l.total_kg)}kg
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Paso 2: Información del Lote */}
        {(selectedOrdenId || isEditing) && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Paso 2: Información del Lote
            </h2>
            <div className="space-y-4">
              {/* Presentación y Categoría */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        "w-full",
                        errors.presentacion && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Seleccionar presentación" />
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
                        "w-full",
                        errors.id_categoria_salida && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Seleccionar categoría" />
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

              <p className="text-xs text-muted-foreground -mt-2">
                La categoría se autocompletó con la de la orden, pero puedes
                cambiarla
              </p>

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
                      ? `Kg por ${getUnidadLabel(
                          presentacionSeleccionada,
                          true
                        )}`
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

              {/* Tipo de Servicio */}
              <div>
                <Label htmlFor="tipo_servicio">Tipo de Servicio</Label>
                <Input
                  id="tipo_servicio"
                  {...register("tipo_servicio")}
                  placeholder="Ej: Tratamiento Premium"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Servicio aplicado al lote (opcional)
                </p>
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
                      Disponible: <strong>{pesoDisponible} kg</strong> | Exceso:{" "}
                      <strong className="text-red-700">
                        {(totalKg - pesoDisponible).toFixed(2)} kg
                      </strong>
                    </p>
                    <p className="text-xs mt-1">
                      Por favor, ajusta el número de{" "}
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
          </div>
        )}

        {/* Botones */}
        {(selectedOrdenId || isEditing) && (
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || excedePeso}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Actualizar" : "Crear"} Lote
            </Button>
          </div>
        )}

        {/* Placeholder inicial */}
        {!selectedOrdenId && !isEditing && (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Selecciona una Orden de Ingreso
            </h3>
            <p className="text-muted-foreground">
              Para crear un lote de producción, primero debes seleccionar una
              orden de ingreso completada.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
