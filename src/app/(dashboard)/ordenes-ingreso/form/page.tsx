"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { ArrowLeft, Loader2, Save } from "lucide-react";
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

const ordenSchema = z.object({
  // numero_orden: z.string().min(1, "Requerido").max(50),
  id_semillera: z.number({ message: "Requerido" }),
  id_cooperador: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }),
  id_variedad: z.number({ message: "Requerido" }),
  id_categoria_ingreso: z.number({ message: "Requerido" }),
  id_unidad: z.number({ message: "Requerido" }),
  nro_lote_campo: z.string().optional(),
  nro_bolsas: z.number().optional(),
  nro_cupon: z.string().optional(),
  lugar_ingreso: z.string().optional(),
  lugar_salida: z.string().optional(),
  peso_bruto: z.number().optional(),
  peso_tara: z.number().optional(),
  peso_neto: z.number().optional(),
  peso_liquido: z.number().optional(),
  porcentaje_humedad: z.number().min(0).max(100).optional(),
  porcentaje_impureza: z.number().min(0).max(100).optional(),
  peso_hectolitrico: z.number().optional(),
  porcentaje_grano_danado: z.number().min(0).max(100).optional(),
  porcentaje_grano_verde: z.number().min(0).max(100).optional(),
  observaciones: z.string().optional(),
  estado: z.string().default("pendiente"),
  // id_usuario_creador: z.number().optional(),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

export default function OrdenIngresoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("id");
  const isEditing = !!ordenId;

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

  useEffect(() => {
    if (isEditing && orden) {
      // Usar setTimeout para asegurar que los datos de catálogos estén cargados
      setTimeout(() => {
        reset({
          id_semillera: orden.id_semillera,
          id_cooperador: orden.id_cooperador,
          id_conductor: orden.id_conductor,
          id_vehiculo: orden.id_vehiculo,
          id_semilla: orden.id_semilla,
          id_unidad: orden.id_unidad,
          id_variedad: orden.id_variedad,
          id_categoria_ingreso: orden.id_categoria_ingreso,
          nro_lote_campo: orden.nro_lote_campo,
          nro_bolsas: orden.nro_bolsas,
          nro_cupon: orden.nro_cupon,
          peso_bruto: orden.peso_bruto,
          peso_tara: orden.peso_tara,
          peso_neto: orden.peso_neto,
          peso_liquido: orden.peso_liquido,
          porcentaje_humedad: orden.porcentaje_humedad,
          porcentaje_impureza: orden.porcentaje_impureza,
          peso_hectolitrico: orden.peso_hectolitrico,
          porcentaje_grano_danado: orden.porcentaje_grano_danado,
          porcentaje_grano_verde: orden.porcentaje_grano_verde,
          observaciones: orden.observaciones,
        });
      }, 100);
    }
  }, [isEditing, orden, reset]);

  // Segundo useEffect: Actualizar la variedad cuando se carguen las variedades
  useEffect(() => {
    if (isEditing && orden && variedades && variedades.length > 0) {
      // Solo actualizar el campo id_variedad si existe en la orden
      if (orden.id_variedad) {
        setValue("id_variedad", orden.id_variedad, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    }
  }, [isEditing, orden, variedades, setValue]); // Reemplaza el useEffect actual con este:

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
        {/* Transporte */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Información de Transporte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id_semillera">
                Semillera <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_semillera")?.toString()}
                onValueChange={(value) =>
                  setValue("id_semillera", Number(value))
                }
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
              {errors.id_semillera && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_semillera">
                Cooperador <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_cooperador")?.toString()}
                onValueChange={(value) =>
                  setValue("id_cooperador", Number(value))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors.id_cooperador && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Seleccionar semillera" />
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
              {errors.id_cooperador && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_conductor">
                Conductor <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_conductor")?.toString()}
                onValueChange={(value) =>
                  setValue("id_conductor", Number(value))
                }
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
                      {conductor.nombre} - <strong>CI:</strong>
                      {conductor.ci}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_conductor && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_vehiculo">
                Vehículo <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_vehiculo")?.toString()}
                onValueChange={(value) =>
                  setValue("id_vehiculo", Number(value))
                }
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
              {errors.id_vehiculo && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>
          </div>
        </div>

        {/* Información de Semilla */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Información de Semilla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="id_semilla">
                Semilla <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_semilla")?.toString()}
                onValueChange={(value) => {
                  setValue("id_semilla", Number(value));
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
              {errors.id_semilla && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_variedad">
                Variedad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_variedad")?.toString()}
                onValueChange={(value) =>
                  setValue("id_variedad", Number(value))
                }
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
              {errors.id_variedad && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_categoria_ingreso">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_categoria_ingreso")?.toString()}
                onValueChange={(value) =>
                  setValue("id_categoria_ingreso", Number(value))
                }
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
              {errors.id_categoria_ingreso && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="nro_lote_campo">Nº Lote Campo</Label>
              <Input id="nro_lote_campo" {...register("nro_lote_campo")} />
            </div>

            <div>
              <Label htmlFor="nro_bolsas">Número de Bolsas</Label>
              <Input
                id="nro_bolsas"
                type="number"
                {...register("nro_bolsas", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="nro_cupon">Nº Cupón</Label>
              <Input id="nro_cupon" {...register("nro_cupon")} />
            </div>
          </div>
        </div>

        {/* Datos de Pesaje */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Datos de Pesaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
              <Input
                id="peso_bruto"
                type="number"
                step="0.01"
                {...register("peso_bruto", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="peso_tara">Peso Tara (kg)</Label>
              <Input
                id="peso_tara"
                type="number"
                step="0.01"
                {...register("peso_tara", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="peso_neto">Peso Neto (kg)</Label>
              <Input
                id="peso_neto"
                type="number"
                step="0.01"
                {...register("peso_neto", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="peso_liquido">Peso Líquido (kg)</Label>
              <Input
                id="peso_liquido"
                type="number"
                step="0.01"
                {...register("peso_liquido", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        {/* Análisis de Laboratorio */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Análisis de Laboratorio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="porcentaje_humedad">% Humedad</Label>
              <Input
                id="porcentaje_humedad"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("porcentaje_humedad", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="porcentaje_impureza">% Impureza</Label>
              <Input
                id="porcentaje_impureza"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("porcentaje_impureza", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="peso_hectolitrico">Peso Hectolítrico</Label>
              <Input
                id="peso_hectolitrico"
                type="number"
                step="0.01"
                {...register("peso_hectolitrico", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="porcentaje_grano_danado">% Grano Dañado</Label>
              <Input
                id="porcentaje_grano_danado"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("porcentaje_grano_danado", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              <Label htmlFor="porcentaje_grano_verde">% Grano Verde</Label>
              <Input
                id="porcentaje_grano_verde"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("porcentaje_grano_verde", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
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
    </div>
  );
}
