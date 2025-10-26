"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, Save } from "lucide-react";
import {
  useCreateOrdenIngreso,
  useOrdenIngreso,
  useUpdateOrdenIngreso,
} from "@/hooks/use-ordenes-ingreso";
import { useSemillerasActivas } from "@/hooks/use-semilleras";
import { useConductoresActivos } from "@/hooks/use-conductores";
import { useVehiculosActivos } from "@/hooks/use-vehiculos";
import { useSemillasActivas } from "@/hooks/use-semillas";
import { useVariedadesBySemilla } from "@/hooks/use-variedades";
import { useCategoriasActivas } from "@/hooks/use-categorias";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useCooperadores } from "@/hooks/use-cooperadores";
import { useAuthStore } from "@/stores/authStore";
import { SemilleraFormDialog } from "@/components/semilleras/semillera-form-dialog";
import { CooperadorFormDialog } from "@/components/cooperadores/cooperador-form-dialog";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";
import { SemillaFormDialog } from "@/components/semillas/semilla-form-dialog";
import { VariedadFormDialog } from "@/components/variedades/variedad-form-dialog";
import { CategoriaFormDialog } from "@/components/categorias/categoria-form-dialog";

const ordenSchema = z.object({
  id_semillera: z.number({ message: "Requerido" }),
  id_cooperador: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }),
  id_variedad: z.number({ message: "Requerido" }),
  id_categoria_ingreso: z.number({ message: "Requerido" }),
  nro_lote_campo: z.string({ message: "Requerido" }).min(1),
  nro_cupon: z.string({ message: "Requerido" }).min(1),
  lugar_ingreso: z.string().optional(),
  lugar_salida: z.string().optional(),
  peso_bruto: z.number({ message: "Requerido" }),
  peso_tara: z.number({ message: "Requerido" }),
  peso_neto: z.number({ message: "Requerido" }),
  peso_liquido: z.number({ message: "Requerido" }),
  porcentaje_humedad: z.number({ message: "Campo requerido" }).min(0).max(100),
  porcentaje_impureza: z.number({ message: "Campo requerido" }).min(0).max(100),
  peso_hectolitrico: z.number({ message: "Campo requerido" }).min(0).max(100),
  porcentaje_grano_danado: z
    .number({ message: "Campo requerido" })
    .min(0)
    .max(100),
  porcentaje_grano_verde: z
    .number({ message: "Campo requerido" })
    .min(0)
    .max(100),
  observaciones: z.string().optional(),
  estado: z.string().default("pendiente"),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

export default function OrdenIngresoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("id");
  const isEditing = !!ordenId;

  // Estados para los diálogos de creación
  const [semilleraDialogOpen, setSemilleraDialogOpen] = useState(false);
  const [cooperadorDialogOpen, setCooperadorDialogOpen] = useState(false);
  const [conductorDialogOpen, setConductorDialogOpen] = useState(false);
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);
  const [semillaDialogOpen, setSemillaDialogOpen] = useState(false);
  const [variedadDialogOpen, setVariedadDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);

  const createMutation = useCreateOrdenIngreso();
  const updateMutation = useUpdateOrdenIngreso();
  const { data: orden, isLoading: isLoadingOrden } = useOrdenIngreso(
    isEditing ? Number(ordenId) : null
  );

  const { user } = useAuthStore();

  // Cargar datos de catálogos
  const { data: semilleras } = useSemillerasActivas();
  const { data: conductores } = useConductoresActivos();
  const { data: vehiculos } = useVehiculosActivos();
  const { data: semillas } = useSemillasActivas();
  const { data: categorias } = useCategoriasActivas();
  const { data: cooperadores } = useCooperadores({
    page: 1,
    limit: 100,
    search: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
    defaultValues: {
      id_unidad: user?.id_unidad,
      estado: "pendiente",
    },
  });

  const selectedSemillaId = watch("id_semilla");
  const { data: variedades } = useVariedadesBySemilla(
    selectedSemillaId || null
  );

  // Watch para cálculo automático de peso neto
  const pesoBruto = watch("peso_bruto");
  const pesoTara = watch("peso_tara");

  // Calcular peso neto automáticamente
  const pesoNetoCalculado = useMemo(() => {
    if (pesoBruto && pesoTara) {
      return Number((pesoBruto - pesoTara).toFixed(2));
    }
    return undefined;
  }, [pesoBruto, pesoTara]);

  // Actualizar peso neto cuando cambie el cálculo
  useEffect(() => {
    if (pesoNetoCalculado !== undefined) {
      setValue("peso_neto", pesoNetoCalculado);
    }
  }, [pesoNetoCalculado, setValue]);

  useEffect(() => {
    if (isEditing && orden) {
      reset({
        id_semillera: orden.id_semillera,
        id_cooperador: orden.id_cooperador,
        id_conductor: orden.id_conductor,
        id_vehiculo: orden.id_vehiculo,
        id_semilla: orden.id_semilla,
        id_variedad: orden.id_variedad,
        id_categoria_ingreso: orden.id_categoria_ingreso,
        nro_lote_campo: orden.nro_lote_campo,
        nro_cupon: orden.nro_cupon,
        // Parsear valores numéricos que vienen como string
        peso_bruto: orden.peso_bruto ? Number(orden.peso_bruto) : undefined,
        peso_tara: orden.peso_tara ? Number(orden.peso_tara) : undefined,
        peso_neto: orden.peso_neto ? Number(orden.peso_neto) : undefined,
        peso_liquido: orden.peso_liquido
          ? Number(orden.peso_liquido)
          : undefined,
        porcentaje_humedad: orden.porcentaje_humedad
          ? Number(orden.porcentaje_humedad)
          : undefined,
        porcentaje_impureza: orden.porcentaje_impureza
          ? Number(orden.porcentaje_impureza)
          : undefined,
        peso_hectolitrico: orden.peso_hectolitrico
          ? Number(orden.peso_hectolitrico)
          : undefined,
        porcentaje_grano_danado: orden.porcentaje_grano_danado
          ? Number(orden.porcentaje_grano_danado)
          : undefined,
        porcentaje_grano_verde: orden.porcentaje_grano_verde
          ? Number(orden.porcentaje_grano_verde)
          : undefined,
        observaciones: orden.observaciones,
      });
    }
  }, [isEditing, orden, reset]);

  const onSubmit = async (data: OrdenFormData) => {
    console.log(data);
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: Number(ordenId),
        dto: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    router.push("/ordenes-ingreso");
  };

  // Función para validar y limitar valores de porcentaje
  const handlePercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof OrdenFormData
  ) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setValue(fieldName, undefined);
      return;
    }
    if (value > 100) {
      setValue(fieldName, 100);
    } else if (value < 0) {
      setValue(fieldName, 0);
    } else {
      setValue(fieldName, value);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingOrden;

  if (isLoadingOrden && isEditing) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/ordenes-ingreso")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Editar Orden de Ingreso" : "Nueva Orden de Ingreso"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Transporte - Solo lectura en edición */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Información de Transporte
          </h2>

          {isEditing ? (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Semillera
                  </Label>
                  <p className="font-medium mt-1">{orden?.semillera?.nombre}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Cooperador
                  </Label>
                  <p className="font-medium mt-1">
                    {orden?.cooperador?.nombre}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Conductor
                  </Label>
                  <p className="font-medium mt-1">
                    {orden?.conductor?.nombre} - CI: {orden?.conductor?.ci}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Vehículo
                  </Label>
                  <p className="font-medium mt-1">
                    {orden?.vehiculo?.marca_modelo} - Placa:{" "}
                    {orden?.vehiculo?.placa}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                * La información de transporte no puede modificarse en modo
                edición
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SEMILLERA */}
              <div>
                <Label htmlFor="id_semillera">
                  Semillera <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_semillera"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_semillera && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar semillera" />
                        </SelectTrigger>
                        <SelectContent>
                          {semilleras?.map((semillera) => (
                            <SelectItem
                              key={semillera.id_semillera}
                              value={semillera.id_semillera.toString()}
                            >
                              {semillera.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setSemilleraDialogOpen(true)}
                    title="Crear nueva semillera"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_semillera && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_semillera.message}
                  </p>
                )}
              </div>

              {/* COOPERADOR */}
              <div>
                <Label htmlFor="id_cooperador">
                  Cooperador <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_cooperador"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_cooperador && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar cooperador" />
                        </SelectTrigger>
                        <SelectContent>
                          {cooperadores?.data?.map((cooperador) => (
                            <SelectItem
                              key={cooperador.id_cooperador}
                              value={cooperador.id_cooperador.toString()}
                            >
                              {cooperador.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCooperadorDialogOpen(true)}
                    title="Crear nuevo cooperador"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_cooperador && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_cooperador.message}
                  </p>
                )}
              </div>

              {/* CONDUCTOR */}
              <div>
                <Label htmlFor="id_conductor">
                  Conductor <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_conductor"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_conductor && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar conductor" />
                        </SelectTrigger>
                        <SelectContent>
                          {conductores?.map((conductor) => (
                            <SelectItem
                              key={conductor.id_conductor}
                              value={conductor.id_conductor.toString()}
                            >
                              {conductor.nombre} - <strong>CI:</strong>{" "}
                              {conductor.ci}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setConductorDialogOpen(true)}
                    title="Crear nuevo conductor"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_conductor && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_conductor.message}
                  </p>
                )}
              </div>

              {/* VEHÍCULO */}
              <div>
                <Label htmlFor="id_vehiculo">
                  Vehículo <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_vehiculo"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_vehiculo && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehiculos?.map((vehiculo) => (
                            <SelectItem
                              key={vehiculo.id_vehiculo}
                              value={vehiculo.id_vehiculo.toString()}
                            >
                              {vehiculo.marca_modelo} - <strong>Placa:</strong>{" "}
                              {vehiculo.placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setVehiculoDialogOpen(true)}
                    title="Crear nuevo vehículo"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_vehiculo && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_vehiculo.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información de Semilla - Solo lectura en edición */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Información de Semilla</h2>

          {isEditing ? (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Semilla
                  </Label>
                  <p className="font-medium mt-1">{orden?.semilla?.nombre}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Variedad
                  </Label>
                  <p className="font-medium mt-1">{orden?.variedad?.nombre}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Categoría
                  </Label>
                  <p className="font-medium mt-1">
                    {orden?.categoria_ingreso?.nombre}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Nº Lote Campo
                  </Label>
                  <p className="font-medium mt-1">
                    {orden?.nro_lote_campo || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Nº Cupón
                  </Label>
                  <p className="font-medium mt-1">{orden?.nro_cupon || "-"}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                * La información de semilla no puede modificarse en modo edición
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SEMILLA */}
              <div>
                <Label htmlFor="id_semilla">
                  Semilla <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_semilla"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          setValue("id_variedad", undefined as any);
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_semilla && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar semilla" />
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
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setSemillaDialogOpen(true)}
                    title="Crear nueva semilla"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_semilla && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_semilla.message?.toString()}
                  </p>
                )}
              </div>
              {/* VARIEDAD */}
              <div>
                <Label htmlFor="id_variedad">
                  Variedad <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_variedad"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={!selectedSemillaId}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_variedad && "border-red-500"
                          )}
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
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setVariedadDialogOpen(true)}
                    disabled={!selectedSemillaId}
                    title="Crear nueva variedad"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_variedad && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_variedad.message?.toString()}
                  </p>
                )}
              </div>
              {/* CATEGORÍA */}
              <div>
                <Label htmlFor="id_categoria_ingreso">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="id_categoria_ingreso"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.id_categoria_ingreso && "border-red-500"
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
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCategoriaDialogOpen(true)}
                    title="Crear nueva categoría"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.id_categoria_ingreso && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.id_categoria_ingreso.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nro_lote_campo">
                  Nº Lote Campo<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nro_lote_campo"
                  {...register("nro_lote_campo")}
                  className={errors.nro_lote_campo ? "border-red-500" : ""}
                />
                {errors.nro_lote_campo && (
                  <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                )}
              </div>

              <div>
                <Label htmlFor="nro_cupon">
                  Nº Cupón<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nro_cupon"
                  {...register("nro_cupon")}
                  className={errors.nro_lote_campo ? "border-red-500" : ""}
                />
                {errors.nro_cupon && (
                  <p className="text-sm text-red-500 mt-1">Campo requerido</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Datos de Pesaje - SIEMPRE EDITABLE */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Datos de Pesaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso_bruto">
                Peso Bruto (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_bruto"
                type="number"
                step="0.01"
                className={errors.peso_bruto ? "border-red-500" : ""}
                {...register("peso_bruto", { valueAsNumber: true })}
              />
              {errors.peso_bruto && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_tara">
                Peso Tara (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_tara"
                type="number"
                step="0.01"
                className={errors.peso_tara ? "border-red-500" : ""}
                {...register("peso_tara", { valueAsNumber: true })}
              />
              {errors.peso_tara && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_neto">
                Peso Neto (kg) <span className="text-red-500">*</span>
                <span className="text-blue-600 text-xs">
                  (Calculado automáticamente)
                </span>
              </Label>
              <Input
                id="peso_neto"
                type="number"
                step="0.01"
                value={pesoNetoCalculado || ""}
                readOnly
                className="bg-muted/50 cursor-not-allowed"
              />

              <p className="text-xs text-muted-foreground mt-1">
                Peso Neto = Peso Bruto - Peso Tara
              </p>
            </div>

            <div>
              <Label htmlFor="peso_liquido">
                Peso Líquido (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_liquido"
                type="number"
                step="0.01"
                className={errors.peso_liquido ? "border-red-500" : ""}
                {...register("peso_liquido", { valueAsNumber: true })}
              />
              {errors.peso_liquido && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>
          </div>
        </div>

        {/* Análisis de Laboratorio - SIEMPRE EDITABLE */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Análisis de Laboratorio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="porcentaje_humedad">% Humedad (0-100)</Label>
              <Input
                id="porcentaje_humedad"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={errors.porcentaje_humedad ? "border-red-500" : ""}
                {...register("porcentaje_humedad", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 0 && value <= 100) || "Debe estar entre 0 y 100",
                  onChange: (e) =>
                    handlePercentageChange(e, "porcentaje_humedad"),
                })}
              />
              {errors.porcentaje_humedad && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_humedad.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="porcentaje_impureza">% Impureza (0-100)</Label>
              <Input
                id="porcentaje_impureza"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={errors.porcentaje_impureza ? "border-red-500" : ""}
                {...register("porcentaje_impureza", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 0 && value <= 100) || "Debe estar entre 0 y 100",
                  onChange: (e) =>
                    handlePercentageChange(e, "porcentaje_impureza"),
                })}
              />
              {errors.porcentaje_impureza && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_impureza.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_hectolitrico">
                Peso Hectolítrico (0-100)
              </Label>
              <Input
                id="peso_hectolitrico"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={errors.peso_hectolitrico ? "border-red-500" : ""}
                {...register("peso_hectolitrico", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 0 && value <= 100) || "Debe estar entre 0 y 100",
                  onChange: (e) =>
                    handlePercentageChange(e, "peso_hectolitrico"),
                })}
              />
              {errors.peso_hectolitrico && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.peso_hectolitrico.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="porcentaje_grano_danado">
                % Grano Dañado (0-100)
              </Label>
              <Input
                id="porcentaje_grano_danado"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={
                  errors.porcentaje_grano_danado ? "border-red-500" : ""
                }
                {...register("porcentaje_grano_danado", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 0 && value <= 100) || "Debe estar entre 0 y 100",
                  onChange: (e) =>
                    handlePercentageChange(e, "porcentaje_grano_danado"),
                })}
              />
              {errors.porcentaje_grano_danado && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_grano_danado.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="porcentaje_grano_verde">
                % Grano Verde (0-100)
              </Label>
              <Input
                id="porcentaje_grano_verde"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className={
                  errors.porcentaje_grano_verde ? "border-red-500" : ""
                }
                {...register("porcentaje_grano_verde", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 0 && value <= 100) || "Debe estar entre 0 y 100",
                  onChange: (e) =>
                    handlePercentageChange(e, "porcentaje_grano_verde"),
                })}
              />
              {errors.porcentaje_grano_verde && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_grano_verde.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Observaciones - SIEMPRE EDITABLE */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Observaciones</h2>
          <Textarea
            id="observaciones"
            {...register("observaciones")}
            rows={4}
            placeholder="Observaciones adicionales..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/ordenes-ingreso")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Actualizar" : "Crear"} Orden
          </Button>
        </div>
      </form>

      {/* Diálogos de creación rápida */}
      <SemilleraFormDialog
        open={semilleraDialogOpen}
        onOpenChange={setSemilleraDialogOpen}
      />

      <CooperadorFormDialog
        open={cooperadorDialogOpen}
        onOpenChange={setCooperadorDialogOpen}
      />

      <ConductorFormDialog
        open={conductorDialogOpen}
        onOpenChange={setConductorDialogOpen}
      />

      <VehiculoFormDialog
        open={vehiculoDialogOpen}
        onOpenChange={setVehiculoDialogOpen}
      />

      <SemillaFormDialog
        open={semillaDialogOpen}
        onOpenChange={setSemillaDialogOpen}
      />

      <VariedadFormDialog
        open={variedadDialogOpen}
        onOpenChange={setVariedadDialogOpen}
      />

      <CategoriaFormDialog
        open={categoriaDialogOpen}
        onOpenChange={setCategoriaDialogOpen}
      />
    </div>
  );
}
