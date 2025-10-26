"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Loader2,
  Save,
  Info,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { useCooperadores } from "@/hooks/use-cooperadores";
import { useAuthStore } from "@/stores/authStore";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importar los diálogos de creación rápida
import { SemilleraFormDialog } from "@/components/semilleras/semillera-form-dialog";
import { CooperadorFormDialog } from "@/components/cooperadores/cooperador-form-dialog";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";
import { SemillaFormDialog } from "@/components/semillas/semilla-form-dialog";
import { VariedadFormDialog } from "@/components/variedades/variedad-form-dialog";
import { CategoriaFormDialog } from "@/components/categorias/categoria-form-dialog";

// Schema para CREAR
const createOrdenSchema = z.object({
  id_semillera: z.number({ message: "Requerido" }),
  id_cooperador: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }),
  id_variedad: z.number({ message: "Requerido" }),
  id_categoria_ingreso: z.number({ message: "Requerido" }),
  id_unidad: z.number({ message: "Requerido" }),
  nro_lote_campo: z.string().optional(),
  nro_cupon: z.string().optional(),
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
});

// Schema para EDITAR
const updateOrdenSchema = z.object({
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
});

type CreateOrdenFormData = z.infer<typeof createOrdenSchema>;
type UpdateOrdenFormData = z.infer<typeof updateOrdenSchema>;

// Componente para Select con botón de creación rápida
const SelectWithCreate = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  onCreateClick,
  error,
  disabled = false,
  renderOption,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: any[];
  onCreateClick: () => void;
  error?: any;
  disabled?: boolean;
  renderOption: (item: any) => React.ReactNode;
}) => (
  <div>
    <Label>
      {label} <span className="text-red-500">*</span>
    </Label>
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn("flex-1", error && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((item) => renderOption(item))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onCreateClick}
        disabled={disabled}
        title={`Crear nuevo ${label.toLowerCase()}`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    {error && <p className="text-sm text-red-500 mt-1">Campo requerido</p>}
  </div>
);

// Componente para mostrar información no editable
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p className="text-xs font-medium text-blue-900 mb-1">{label}</p>
    <p className="text-base font-semibold text-gray-900">
      {value || "No especificado"}
    </p>
  </div>
);

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

  // Estados para controlar los diálogos de creación rápida
  const [semilleraDialogOpen, setSemilleraDialogOpen] = useState(false);
  const [cooperadorDialogOpen, setCooperadorDialogOpen] = useState(false);
  const [conductorDialogOpen, setConductorDialogOpen] = useState(false);
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);
  const [semillaDialogOpen, setSemillaDialogOpen] = useState(false);
  const [variedadDialogOpen, setVariedadDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);

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
  } = useForm<CreateOrdenFormData | UpdateOrdenFormData>({
    resolver: zodResolver(isEditing ? updateOrdenSchema : createOrdenSchema),
    defaultValues: isEditing
      ? {}
      : {
          id_unidad: user?.id_unidad,
        },
  });

  const selectedSemillaId = watch("id_semilla");
  const { data: variedades } = useVariedadesBySemilla(
    selectedSemillaId || null
  );

  useEffect(() => {
    if (isEditing && orden) {
      reset({
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
    }
  }, [isEditing, orden, reset]);

  // Handlers para autoseleccionar después de crear
  const handleSemilleraCreated = () => {
    // Después de crear, el hook invalidará la query y recargará la lista
    // El nuevo item estará disponible automáticamente
  };

  const onSubmit = async (data: CreateOrdenFormData | UpdateOrdenFormData) => {
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: Number(ordenId),
        dto: data,
      });
    } else {
      await createMutation.mutateAsync(data as CreateOrdenFormData);
    }
    router.push("/ordenes-ingreso");
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingOrden;

  if (isLoadingOrden && isEditing) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/ordenes-ingreso")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Editar Orden de Ingreso" : "Nueva Orden de Ingreso"}
            </h1>
            {isEditing && orden && (
              <p className="text-muted-foreground mt-1">
                Orden:{" "}
                <span className="font-mono font-semibold">
                  {orden.numero_orden}
                </span>
              </p>
            )}
          </div>

          {isEditing && (
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Solo se puede editar:{" "}
                <strong>pesaje, laboratorio y observaciones</strong>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* MODO EDICIÓN: Mostrar info como solo lectura */}
        {isEditing && orden && (
          <>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Información de Transporte
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  Solo lectura
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Semillera" value={orden.semillera?.nombre} />
                <InfoField
                  label="Cooperador"
                  value={orden.cooperador?.nombre}
                />
                <InfoField label="Conductor" value={orden.conductor?.nombre} />
                <InfoField
                  label="Vehículo"
                  value={`${orden.vehiculo?.placa} - ${orden.vehiculo?.marca_modelo}`}
                />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Información de Semilla
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  Solo lectura
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Semilla" value={orden.semilla?.nombre} />
                <InfoField label="Variedad" value={orden.variedad?.nombre} />
                <InfoField
                  label="Categoría"
                  value={orden.categoria_ingreso?.nombre}
                />
                <InfoField
                  label="Nº Lote Campo"
                  value={orden.nro_lote_campo || ""}
                />
                <InfoField label="Nº Cupón" value={orden.nro_cupon || ""} />
              </div>
            </div>
          </>
        )}

        {/* MODO CREACIÓN: Formularios con creación rápida */}
        {!isEditing && (
          <>
            {/* Transporte */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Información de Transporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectWithCreate
                  label="Semillera"
                  placeholder="Seleccionar semillera"
                  value={watch("id_semillera")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_semillera", Number(value))
                  }
                  options={semilleras || []}
                  onCreateClick={() => setSemilleraDialogOpen(true)}
                  error={errors.id_semillera}
                  renderOption={(s) => (
                    <SelectItem
                      key={s.id_semillera}
                      value={s.id_semillera.toString()}
                    >
                      {s.nombre}
                    </SelectItem>
                  )}
                />

                <SelectWithCreate
                  label="Cooperador"
                  placeholder="Seleccionar cooperador"
                  value={watch("id_cooperador")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_cooperador", Number(value))
                  }
                  options={cooperadores?.data || []}
                  onCreateClick={() => setCooperadorDialogOpen(true)}
                  error={errors.id_cooperador}
                  renderOption={(c) => (
                    <SelectItem
                      key={c.id_cooperador}
                      value={c.id_cooperador.toString()}
                    >
                      {c.nombre}
                    </SelectItem>
                  )}
                />

                <SelectWithCreate
                  label="Conductor"
                  placeholder="Seleccionar conductor"
                  value={watch("id_conductor")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_conductor", Number(value))
                  }
                  options={conductores || []}
                  onCreateClick={() => setConductorDialogOpen(true)}
                  error={errors.id_conductor}
                  renderOption={(c) => (
                    <SelectItem
                      key={c.id_conductor}
                      value={c.id_conductor.toString()}
                    >
                      {c.nombre} - CI: {c.ci}
                    </SelectItem>
                  )}
                />

                <SelectWithCreate
                  label="Vehículo"
                  placeholder="Seleccionar vehículo"
                  value={watch("id_vehiculo")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_vehiculo", Number(value))
                  }
                  options={vehiculos || []}
                  onCreateClick={() => setVehiculoDialogOpen(true)}
                  error={errors.id_vehiculo}
                  renderOption={(v) => (
                    <SelectItem
                      key={v.id_vehiculo}
                      value={v.id_vehiculo.toString()}
                    >
                      {v.marca_modelo} - Placa: {v.placa}
                    </SelectItem>
                  )}
                />
              </div>
            </div>

            {/* Información de Semilla */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Información de Semilla
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectWithCreate
                  label="Semilla"
                  placeholder="Seleccionar semilla"
                  value={watch("id_semilla")?.toString()}
                  onValueChange={(value) => {
                    setValue("id_semilla", Number(value));
                    setValue("id_variedad", undefined as any);
                  }}
                  options={semillas || []}
                  onCreateClick={() => setSemillaDialogOpen(true)}
                  error={errors.id_semilla}
                  renderOption={(s) => (
                    <SelectItem
                      key={s.id_semilla}
                      value={s.id_semilla.toString()}
                    >
                      {s.nombre}
                    </SelectItem>
                  )}
                />

                <SelectWithCreate
                  label="Variedad"
                  placeholder="Seleccionar variedad"
                  value={watch("id_variedad")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_variedad", Number(value))
                  }
                  options={variedades || []}
                  onCreateClick={() => setVariedadDialogOpen(true)}
                  error={errors.id_variedad}
                  disabled={!selectedSemillaId}
                  renderOption={(v) => (
                    <SelectItem
                      key={v.id_variedad}
                      value={v.id_variedad.toString()}
                    >
                      {v.nombre}
                    </SelectItem>
                  )}
                />

                <SelectWithCreate
                  label="Categoría"
                  placeholder="Seleccionar categoría"
                  value={watch("id_categoria_ingreso")?.toString()}
                  onValueChange={(value) =>
                    setValue("id_categoria_ingreso", Number(value))
                  }
                  options={categorias || []}
                  onCreateClick={() => setCategoriaDialogOpen(true)}
                  error={errors.id_categoria_ingreso}
                  renderOption={(c) => (
                    <SelectItem
                      key={c.id_categoria}
                      value={c.id_categoria.toString()}
                    >
                      {c.nombre}
                    </SelectItem>
                  )}
                />

                <div>
                  <Label htmlFor="nro_lote_campo">Nº Lote Campo</Label>
                  <Input id="nro_lote_campo" {...register("nro_lote_campo")} />
                </div>

                <div>
                  <Label htmlFor="nro_cupon">Nº Cupón</Label>
                  <Input id="nro_cupon" {...register("nro_cupon")} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* DATOS DE PESAJE - Siempre editable */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Datos de Pesaje</h2>
            {isEditing && (
              <Badge variant="default" className="ml-auto">
                Editable
              </Badge>
            )}
          </div>
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

        {/* ANÁLISIS DE LABORATORIO - Siempre editable */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Análisis de Laboratorio</h2>
            {isEditing && (
              <Badge variant="default" className="ml-auto">
                Editable
              </Badge>
            )}
          </div>
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

        {/* OBSERVACIONES */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Observaciones</h2>
            {isEditing && (
              <Badge variant="default" className="ml-auto">
                Editable
              </Badge>
            )}
          </div>
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
