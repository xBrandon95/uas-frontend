"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Package,
  TrendingUp,
} from "lucide-react";
import {
  useCreateOrdenSalida,
  useLotesDisponiblesFiltrados,
} from "@/hooks/use-ordenes-salida";
import { useSemillerasActivas } from "@/hooks/use-semilleras";
import { useSemillasActivas } from "@/hooks/use-semillas";
import { useClientesActivos } from "@/hooks/use-clientes";
import { useConductoresActivos } from "@/hooks/use-conductores";
import { useVehiculosActivos } from "@/hooks/use-vehiculos";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { CreateDetalleOrdenSalidaDto } from "@/types";
import { Combobox } from "@/components/ui/combobox";
import { useQuickCreateDialogsOrdenSalida } from "@/hooks/useQuickCreateDialogsOrdenSalida";
import { FormDialogsOrdenSalida } from "@/components/ordenes-salida/form/FormDialogsOrdenSalida";

const detalleSchema = z.object({
  id_lote_produccion: z.number(),
  id_variedad: z.number(),
  id_categoria: z.number(),
  nro_lote: z.string(),
  tamano: z.string().optional(),
  cantidad_unidades: z.number().min(1, "Mínimo 1 unidad"),
  kg_por_unidad: z.number().min(0.01, "Mínimo 0.01 kg"),
});

const ordenSalidaSchema = z.object({
  id_semillera: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }),
  id_cliente: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  fecha_salida: z.string().optional(),
  deposito: z.string().optional(),
  observaciones: z.string().optional(),
  total_costo_servicio: z
    .number({ message: "Ingresa un número" })
    .min(0, "Debe ser mayor o igual a 0")
    .optional(),
  detalles: z.array(detalleSchema).min(1, "Debe agregar al menos un lote"),
});

type OrdenSalidaFormData = z.infer<typeof ordenSalidaSchema>;

export default function OrdenSalidaFormPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);
  const [selectedSemilleraId, setSelectedSemilleraId] = useState<number | null>(
    null
  );
  const [selectedSemillaId, setSelectedSemillaId] = useState<number | null>(
    null
  );
  const [searchLote, setSearchLote] = useState("");

  const createMutation = useCreateOrdenSalida();
  const { dialogs } = useQuickCreateDialogsOrdenSalida();

  const { data: lotesDisponibles, isLoading: isLoadingLotes } =
    useLotesDisponiblesFiltrados(selectedSemilleraId, selectedSemillaId);

  const { data: semilleras } = useSemillerasActivas();
  const { data: semillas } = useSemillasActivas();
  const { data: clientes } = useClientesActivos();
  const { data: conductores } = useConductoresActivos();
  const { data: vehiculos } = useVehiculosActivos();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrdenSalidaFormData>({
    resolver: zodResolver(ordenSalidaSchema),
    defaultValues: {
      fecha_salida: new Date().toISOString().split("T")[0], // Por defecto la fecha actual
      detalles: [],
      total_costo_servicio: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles");
  const watchedSemillera = watch("id_semillera");
  const watchedSemilla = watch("id_semilla");

  // Actualizar estados cuando cambian los selects
  useMemo(() => {
    if (watchedSemillera) setSelectedSemilleraId(watchedSemillera);
  }, [watchedSemillera]);

  useMemo(() => {
    if (watchedSemilla) setSelectedSemillaId(watchedSemilla);
  }, [watchedSemilla]);

  // Opciones para Combobox
  const semillerasOptions = useMemo(
    () =>
      semilleras?.map((s) => ({
        value: s.id_semillera.toString(),
        label: s.nombre,
      })) || [],
    [semilleras]
  );

  const semillasOptions = useMemo(
    () =>
      semillas?.map((s) => ({
        value: s.id_semilla.toString(),
        label: s.nombre,
      })) || [],
    [semillas]
  );

  const clientesOptions = useMemo(
    () =>
      clientes?.map((c) => ({
        value: c.id_cliente.toString(),
        label: c.nombre,
        sublabel: c.nit ? `NIT: ${c.nit}` : undefined,
      })) || [],
    [clientes]
  );

  const conductoresOptions = useMemo(
    () =>
      conductores?.map((c) => ({
        value: c.id_conductor.toString(),
        label: c.nombre,
        sublabel: `CI: ${c.ci}`,
      })) || [],
    [conductores]
  );

  const vehiculosOptions = useMemo(
    () =>
      vehiculos?.map((v) => ({
        value: v.id_vehiculo.toString(),
        label: v.placa,
        sublabel: v.marca_modelo || undefined,
      })) || [],
    [vehiculos]
  );

  // Filtrar lotes por búsqueda
  const lotesFiltrados = useMemo(() => {
    if (!lotesDisponibles) return [];
    if (!searchLote) return lotesDisponibles;

    const searchLower = searchLote.toLowerCase();
    return lotesDisponibles.filter(
      (lote) =>
        lote.nro_lote.toLowerCase().includes(searchLower) ||
        lote.variedad?.nombre.toLowerCase().includes(searchLower) ||
        lote.categoria_salida?.nombre.toLowerCase().includes(searchLower) ||
        lote.presentacion?.toLowerCase().includes(searchLower)
    );
  }, [lotesDisponibles, searchLote]);

  // Calcular totales
  const totales = useMemo(() => {
    return detalles.reduce(
      (acc, detalle) => {
        const totalKg = detalle.cantidad_unidades * detalle.kg_por_unidad;
        return {
          unidades: acc.unidades + detalle.cantidad_unidades,
          kg: acc.kg + totalKg,
          lotes: acc.lotes + 1,
        };
      },
      { unidades: 0, kg: 0, lotes: 0 }
    );
  }, [detalles]);

  // Agregar lote seleccionado
  const handleAgregarLote = useCallback(() => {
    if (!selectedLoteId) return;

    const lote = lotesDisponibles?.find(
      (l) => l.id_lote_produccion === selectedLoteId
    );
    if (!lote) return;

    const yaExiste = detalles.some(
      (d) => d.id_lote_produccion === selectedLoteId
    );
    if (yaExiste) {
      alert("Este lote ya está agregado a la orden");
      return;
    }

    const nuevoDetalle: CreateDetalleOrdenSalidaDto = {
      id_lote_produccion: lote.id_lote_produccion,
      id_variedad: lote.id_variedad,
      id_categoria: lote.id_categoria_salida,
      nro_lote: lote.nro_lote,
      tamano: lote.presentacion || "",
      cantidad_unidades: 1,
      kg_por_unidad: Number(lote.kg_por_unidad),
    };

    append(nuevoDetalle);
    setSelectedLoteId(null);
    setSearchLote("");
  }, [selectedLoteId, lotesDisponibles, detalles, append]);

  // Validar unidades antes de enviar
  const validarUnidades = useCallback(() => {
    for (const detalle of detalles) {
      const lote = lotesDisponibles?.find(
        (l) => l.id_lote_produccion === detalle.id_lote_produccion
      );
      if (lote && detalle.cantidad_unidades > lote.cantidad_unidades) {
        return {
          valido: false,
          mensaje: `El lote ${lote.nro_lote} solo tiene ${lote.cantidad_unidades} unidades disponibles`,
        };
      }
    }
    return { valido: true };
  }, [detalles, lotesDisponibles]);

  // Handlers para abrir modales de creación rápida
  const handleOpenCliente = () => {
    dialogs.cliente.setOnCreated((id: number) => {
      setValue("id_cliente", id);
      dialogs.cliente.setOnCreated(null);
    });
    dialogs.cliente.setOpen(true);
  };

  const handleOpenConductor = () => {
    dialogs.conductor.setOnCreated((id: number) => {
      setValue("id_conductor", id);
      dialogs.conductor.setOnCreated(null);
    });
    dialogs.conductor.setOpen(true);
  };

  const handleOpenVehiculo = () => {
    dialogs.vehiculo.setOnCreated((id: number) => {
      setValue("id_vehiculo", id);
      dialogs.vehiculo.setOnCreated(null);
    });
    dialogs.vehiculo.setOpen(true);
  };

  const onSubmit = async (data: OrdenSalidaFormData) => {
    const validacion = validarUnidades();
    if (!validacion.valido) {
      alert(validacion.mensaje);
      return;
    }

    const dto = {
      ...data,
      id_unidad: user?.id_unidad!,
      estado: "pendiente",
    };

    await createMutation.mutateAsync(dto);
    router.push("/ordenes-salida");
  };

  const isLoading = createMutation.isPending || isLoadingLotes;
  const puedeAgregarLotes = selectedSemilleraId && selectedSemillaId;

  return (
    <>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/ordenes-salida")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Nueva Orden de Salida</h1>
          <p className="text-muted-foreground mt-1">
            Crea una nueva orden de salida/venta de productos
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SEMILLERA */}
                <div>
                  <Label htmlFor="id_semillera">
                    Semillera <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="id_semillera"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Combobox
                        options={semillerasOptions}
                        value={field.value?.toString()}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          setValue("detalles", []);
                        }}
                        placeholder="Buscar semillera..."
                        searchPlaceholder="Escriba para buscar..."
                        emptyText="No se encontraron semilleras"
                        error={!!errors.id_semillera}
                        className="w-full mt-2"
                      />
                    )}
                  />
                  {errors.id_semillera && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div>

                {/* SEMILLA */}
                <div>
                  <Label htmlFor="id_semilla">
                    Semilla <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="id_semilla"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Combobox
                        options={semillasOptions}
                        value={field.value?.toString()}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          setValue("detalles", []);
                        }}
                        placeholder="Buscar semilla..."
                        searchPlaceholder="Escriba para buscar..."
                        emptyText="No se encontraron semillas"
                        error={!!errors.id_semilla}
                        className="w-full mt-2"
                      />
                    )}
                  />
                  {errors.id_semilla && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div>

                {/* CLIENTE */}
                <div>
                  <Label htmlFor="id_cliente">
                    Cliente <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2 items-start">
                    <Controller
                      name="id_cliente"
                      control={control}
                      rules={{ required: "Campo requerido" }}
                      render={({ field }) => (
                        <Combobox
                          options={clientesOptions}
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          placeholder="Buscar cliente..."
                          searchPlaceholder="Escriba para buscar..."
                          emptyText="No se encontraron clientes"
                          error={!!errors.id_cliente}
                          className="flex-1"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleOpenCliente}
                      title="Crear nuevo cliente"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.id_cliente && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div>

                {/* CONDUCTOR */}
                <div>
                  <Label htmlFor="id_conductor">
                    Conductor <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2 items-start">
                    <Controller
                      name="id_conductor"
                      control={control}
                      rules={{ required: "Campo requerido" }}
                      render={({ field }) => (
                        <Combobox
                          options={conductoresOptions}
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          placeholder="Buscar conductor..."
                          searchPlaceholder="Escriba para buscar..."
                          emptyText="No se encontraron conductores"
                          error={!!errors.id_conductor}
                          className="flex-1"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleOpenConductor}
                      title="Crear nuevo conductor"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.id_conductor && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div>

                {/* VEHÍCULO */}
                <div>
                  <Label htmlFor="id_vehiculo">
                    Vehículo <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2 items-start">
                    <Controller
                      name="id_vehiculo"
                      control={control}
                      rules={{ required: "Campo requerido" }}
                      render={({ field }) => (
                        <Combobox
                          options={vehiculosOptions}
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          placeholder="Buscar vehículo..."
                          searchPlaceholder="Escriba para buscar..."
                          emptyText="No se encontraron vehículos"
                          error={!!errors.id_vehiculo}
                          className="flex-1"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleOpenVehiculo}
                      title="Crear nuevo vehículo"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.id_vehiculo && (
                    <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="total_costo_servicio">
                    Total Costo Servicio (Bs.){" "}
                    <span className="text-muted-foreground text-xs">
                      (Opcional)
                    </span>
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="total_costo_servicio"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("total_costo_servicio", {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      className={cn(
                        errors.total_costo_servicio ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {errors.total_costo_servicio && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.total_costo_servicio.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deposito">Depósito</Label>
                  <Input
                    id="deposito"
                    {...register("deposito")}
                    placeholder="Depósito destino (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    {...register("observaciones")}
                    rows={3}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selección de Lotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Agregar Lotes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!puedeAgregarLotes && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    Importante: Primero debes seleccionar una Semillera y una
                    Semilla para poder agregar lotes.
                  </AlertDescription>
                </Alert>
              )}

              {puedeAgregarLotes && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                  {lotesFiltrados.length > 0 ? (
                    lotesFiltrados.map((lote) => {
                      const yaAgregado = detalles.some(
                        (d) => d.id_lote_produccion === lote.id_lote_produccion
                      );

                      return (
                        <Card
                          key={lote.id_lote_produccion}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedLoteId === lote.id_lote_produccion &&
                              "ring-2 ring-primary",
                            yaAgregado && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() =>
                            !yaAgregado &&
                            setSelectedLoteId(lote.id_lote_produccion)
                          }
                        >
                          <CardContent>
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="font-mono">
                                {lote.nro_lote}
                              </Badge>
                              {yaAgregado && (
                                <Badge variant="secondary" className="text-xs">
                                  Agregado
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-sm mb-1">
                              {lote.variedad?.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {lote.categoria_salida?.nombre} •{" "}
                              {lote.presentacion}
                            </p>
                            <div className="flex justify-between text-xs">
                              <span>
                                <strong>{lote.cantidad_unidades}</strong>{" "}
                                unidades
                              </span>
                              <span className="text-muted-foreground">
                                {Number(lote.kg_por_unidad)} kg/u
                              </span>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <span className="text-sm font-semibold text-primary">
                                {Number(lote.total_kg)} kg total
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      {searchLote
                        ? `No se encontraron lotes para "${searchLote}"`
                        : "No hay lotes disponibles para esta combinación"}
                    </div>
                  )}
                </div>
              )}

              {selectedLoteId && (
                <Button
                  type="button"
                  onClick={handleAgregarLote}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Lote Seleccionado
                </Button>
              )}

              {errors.detalles?.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.detalles.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Tabla de Detalles */}
          {fields.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lotes Agregados ({totales.lotes})</CardTitle>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{totales.unidades}</span>
                      <span className="text-muted-foreground">unidades</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold font-mono">
                        {totales.kg.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">kg</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lote</TableHead>
                        <TableHead>Variedad</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="w-32">Unidades</TableHead>
                        <TableHead className="w-32">Kg/Unidad</TableHead>
                        <TableHead>Total Kg</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const lote = lotesDisponibles?.find(
                          (l) =>
                            l.id_lote_produccion === field.id_lote_produccion
                        );
                        const totalKg =
                          watch(`detalles.${index}.cantidad_unidades`) *
                          watch(`detalles.${index}.kg_por_unidad`);
                        const excedeDisponible =
                          lote &&
                          watch(`detalles.${index}.cantidad_unidades`) >
                            lote.cantidad_unidades;

                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Badge variant="outline">{field.nro_lote}</Badge>
                            </TableCell>
                            <TableCell>{lote?.variedad?.nombre}</TableCell>
                            <TableCell>
                              <Badge>{lote?.categoria_salida?.nombre}</Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <Input
                                  type="number"
                                  min="1"
                                  max={lote?.cantidad_unidades}
                                  {...register(
                                    `detalles.${index}.cantidad_unidades`,
                                    { valueAsNumber: true }
                                  )}
                                  className={cn(
                                    "w-24",
                                    excedeDisponible && "border-red-500"
                                  )}
                                />
                                {excedeDisponible && (
                                  <p className="text-xs text-red-500 mt-1">
                                    Máx: {lote.cantidad_unidades}
                                  </p>
                                )}
                                {lote && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Disponible: {lote.cantidad_unidades}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                readOnly
                                {...register(
                                  `detalles.${index}.kg_por_unidad`,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-mono">
                                {totalKg.toFixed(2)} kg
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/ordenes-salida")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || fields.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Crear Orden
            </Button>
          </div>
        </form>
      </div>

      {/* Modales de creación rápida */}
      <FormDialogsOrdenSalida dialogs={dialogs} />
    </>
  );
}
