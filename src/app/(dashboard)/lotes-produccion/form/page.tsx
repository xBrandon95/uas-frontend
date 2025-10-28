"use client";

import { useEffect, useState, useMemo } from "react";
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
  useOrdenesIngreso,
  useOrdenIngreso,
} from "@/hooks/use-ordenes-ingreso";
import { useVariedadesBySemilla } from "@/hooks/use-variedades";
import { useCategoriasActivas } from "@/hooks/use-categorias";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const loteSchema = z.object({
  id_orden_ingreso: z.number({ message: "Requerido" }),
  id_categoria_salida: z.number({ message: "Requerido" }),
  nro_bolsas: z.number().min(1, "Mínimo 1 bolsa"),
  kg_por_bolsa: z.number().min(0.01, "Mínimo 0.01 kg"),
  presentacion: z.string().optional(),
  tipo_servicio: z.string().optional(),
  fecha_produccion: z.string().optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

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

  // Cargar datos
  const { data: ordenes } = useOrdenesDisponiblesParaLotes();
  const { data: ordenSeleccionada } = useOrdenIngreso(selectedOrdenId);
  const { data: lotesExistentes } = useLotesByOrdenIngreso(selectedOrdenId);
  const { data: categorias } = useCategoriasActivas();

  const selectedSemillaId = ordenSeleccionada?.id_semilla;
  const { data: variedades } = useVariedadesBySemilla(
    selectedSemillaId || null
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
      estado: "disponible",
    },
  });

  const nroBolsas = watch("nro_bolsas") || 0;
  const kgPorBolsa = watch("kg_por_bolsa") || 0;
  const totalKg = useMemo(
    () => nroBolsas * kgPorBolsa,
    [nroBolsas, kgPorBolsa]
  );

  // Calcular totales de la orden
  const pesoNetoOrden = ordenSeleccionada?.peso_neto || 0;
  const totalProducido = useMemo(() => {
    if (!lotesExistentes) return 0;
    return lotesExistentes.reduce((sum, l) => sum + Number(l.total_kg), 0);
  }, [lotesExistentes]);
  const pesoDisponible = pesoNetoOrden - totalProducido;
  const excedePeso = totalKg > pesoDisponible;

  useEffect(() => {
    if (isEditing && lote) {
      setSelectedOrdenId(lote.id_orden_ingreso);
      reset({
        id_orden_ingreso: lote.id_orden_ingreso,
        id_categoria_salida: lote.id_categoria_salida,
        nro_bolsas: lote.nro_bolsas,
        kg_por_bolsa: Number(lote.kg_por_bolsa),
        presentacion: lote.presentacion,
        tipo_servicio: lote.tipo_servicio,
        fecha_produccion: lote.fecha_produccion
          ? new Date(lote.fecha_produccion).toISOString().split("T")[0]
          : undefined,
        id_unidad: lote.id_unidad,
        estado: lote.estado,
      });
    }
  }, [isEditing, lote, reset]);

  const onSubmit = async (data: LoteFormData) => {
    data.id_unidad = ordenSeleccionada?.id_unidad;
    data.estado = "disponible";
    data.id_variedad = ordenSeleccionada?.id_variedad;

    if (!isEditing && excedePeso) {
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: Number(loteId),
          dto: data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      router.push("/lotes-produccion");
    } catch (error) {
      // Error manejado por el hook
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingLote;

  if (isLoadingLote && isEditing) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/lotes-produccion")}
          className="mb-4"
        >
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
        {/* Selección de Orden de Ingreso */}
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
                  value={selectedOrdenId?.toString()}
                  onValueChange={(value) => {
                    const id = Number(value);
                    setSelectedOrdenId(id);
                    setValue("id_orden_ingreso", id);
                    setValue("id_variedad", undefined as any);
                    setValue("id_unidad", undefined as any);
                  }}
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
                              {l.nro_lote}: {l.nro_bolsas} × {l.kg_por_bolsa}kg
                              = {Number(l.total_kg)}kg
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

        {/* Información del Lote */}
        {(selectedOrdenId || isEditing) && (
          <>
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Paso 2: Información del Lote
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* <div>
                  <Label htmlFor="id_variedad">
                    Variedad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("id_variedad")?.toString()}
                    onValueChange={(value) =>
                      setValue("id_variedad", Number(value))
                    }
                  >
                    <SelectTrigger
                      className={errors.id_variedad ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Seleccionar variedad" />
                    </SelectTrigger>
                    <SelectContent>
                      {variedades?.map((variedad) => (
                        <SelectItem
                          key={variedad.id_variedad}
                          value={variedad.id_variedad.toString()}
                        >
                          {variedad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_variedad && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div> */}

                <div>
                  <Label htmlFor="id_categoria_salida">
                    Categoría de Salida <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("id_categoria_salida")?.toString()}
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

                {/* <div>
                  <Label htmlFor="id_unidad">
                    Unidad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("id_unidad")?.toString()}
                    onValueChange={(value) =>
                      setValue("id_unidad", Number(value))
                    }
                  >
                    <SelectTrigger
                      className={errors.id_unidad ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades?.data?.map((unidad) => (
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
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div> */}

                <div>
                  <Label htmlFor="fecha_produccion">Fecha de Producción</Label>
                  <Input
                    id="fecha_produccion"
                    type="date"
                    {...register("fecha_produccion")}
                  />
                </div>

                {/* <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={watch("estado")}
                    onValueChange={(value) => setValue("estado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="descartado">Descartado</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>

            {/* Cantidades */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Paso 3: Cantidades y Presentación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="nro_bolsas">
                    Número de Bolsas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nro_bolsas"
                    type="number"
                    min="1"
                    {...register("nro_bolsas", { valueAsNumber: true })}
                    className={errors.nro_bolsas ? "border-red-500" : ""}
                  />
                  {errors.nro_bolsas && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.nro_bolsas.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="kg_por_bolsa">
                    Kg por Bolsa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kg_por_bolsa"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register("kg_por_bolsa", { valueAsNumber: true })}
                    className={errors.kg_por_bolsa ? "border-red-500" : ""}
                  />
                  {errors.kg_por_bolsa && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.kg_por_bolsa.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Total Kg (calculado)</Label>
                  <div className="h-10 px-3 flex items-center rounded-md border bg-muted">
                    <Badge
                      variant={
                        excedePeso && !isEditing ? "destructive" : "default"
                      }
                      className="font-mono text-base w-full justify-center"
                    >
                      {totalKg} kg
                    </Badge>
                  </div>
                </div>
              </div>

              {!isEditing && excedePeso && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold">
                      ⚠️ El total excede el peso disponible
                    </p>
                    <p className="text-sm mt-1">
                      Peso del lote: <strong>{totalKg} kg</strong> | Disponible:{" "}
                      <strong>{pesoDisponible} kg</strong> | Exceso:{" "}
                      <strong className="text-red-700">
                        {totalKg - pesoDisponible} kg
                      </strong>
                    </p>
                    <p className="text-xs mt-1">
                      Por favor, ajusta el número de bolsas o los kg por bolsa.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="presentacion">Presentación</Label>
                  <Input
                    id="presentacion"
                    {...register("presentacion")}
                    placeholder="Ej: Bolsa 50kg Certificada"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Descripción de cómo se presenta el producto
                  </p>
                </div>

                <div>
                  <Label htmlFor="tipo_servicio">Tipo de Servicio</Label>
                  <Input
                    id="tipo_servicio"
                    {...register("tipo_servicio")}
                    placeholder="Ej: Tratamiento Premium"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Servicio aplicado al lote
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/lotes-produccion")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || (!isEditing && excedePeso)}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Actualizar" : "Crear"} Lote
              </Button>
            </div>
          </>
        )}

        {/* Mensaje cuando no hay orden seleccionada */}
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
