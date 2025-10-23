"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  AlertCircle,
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

const detalleSchema = z.object({
  id_lote_produccion: z.number(),
  id_variedad: z.number(),
  id_categoria: z.number(),
  nro_lote: z.string(),
  tamano: z.string().optional(),
  nro_bolsas: z.number().min(1, "Mínimo 1 bolsa"),
  kg_bolsa: z.number().min(0.01, "Mínimo 0.01 kg"),
});

const ordenSalidaSchema = z.object({
  id_semillera: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }), // ✅ NUEVO
  id_cliente: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  fecha_salida: z.string().min(1, "Requerido"),
  deposito: z.string().optional(),
  observaciones: z.string().optional(),
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

  const createMutation = useCreateOrdenSalida();

  // ✅ USAR EL NUEVO HOOK CON FILTROS
  const { data: lotesDisponibles, isLoading: isLoadingLotes } =
    useLotesDisponiblesFiltrados(selectedSemilleraId, selectedSemillaId);

  const { data: semilleras } = useSemillerasActivas();
  const { data: semillas } = useSemillasActivas(); // ✅ NUEVO
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
      fecha_salida: new Date().toISOString().split("T")[0],
      detalles: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles");
  const watchedSemillera = watch("id_semillera");
  const watchedSemilla = watch("id_semilla");

  // ✅ Actualizar estados cuando cambian los selects
  useMemo(() => {
    if (watchedSemillera) {
      setSelectedSemilleraId(watchedSemillera);
    }
  }, [watchedSemillera]);

  useMemo(() => {
    if (watchedSemilla) {
      setSelectedSemillaId(watchedSemilla);
    }
  }, [watchedSemilla]);

  // Calcular totales
  const totales = useMemo(() => {
    return detalles.reduce(
      (acc, detalle) => {
        const totalKg = detalle.nro_bolsas * detalle.kg_bolsa;
        return {
          bolsas: acc.bolsas + detalle.nro_bolsas,
          kg: acc.kg + totalKg,
        };
      },
      { bolsas: 0, kg: 0 }
    );
  }, [detalles]);

  // Agregar lote seleccionado
  const handleAgregarLote = () => {
    if (!selectedLoteId) return;

    const lote = lotesDisponibles?.find(
      (l) => l.id_lote_produccion === selectedLoteId
    );
    if (!lote) return;

    // Verificar si el lote ya está en la lista
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
      nro_bolsas: 1,
      kg_bolsa: Number(lote.kg_por_bolsa),
    };

    append(nuevoDetalle);
    setSelectedLoteId(null);
  };

  const onSubmit = async (data: OrdenSalidaFormData) => {
    // Validar que las bolsas no excedan el disponible
    for (const detalle of data.detalles) {
      const lote = lotesDisponibles?.find(
        (l) => l.id_lote_produccion === detalle.id_lote_produccion
      );
      if (lote && detalle.nro_bolsas > lote.nro_bolsas) {
        alert(
          `El lote ${lote.nro_lote} solo tiene ${lote.nro_bolsas} bolsas disponibles`
        );
        return;
      }
    }

    console.log(user);
    const dto = {
      ...data,
      id_unidad: user?.id_unidad!,
      estado: "pendiente",
    };

    await createMutation.mutateAsync(dto);
    router.push("/ordenes-salida");
  };

  const isLoading = createMutation.isPending || isLoadingLotes;

  return (
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
          Crea una nueva orden de salida/venta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información General */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id_semillera">
                Semillera <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_semillera")?.toString()}
                onValueChange={(value) => {
                  setValue("id_semillera", Number(value));
                  // Limpiar detalles al cambiar semillera
                  setValue("detalles", []);
                }}
              >
                <SelectTrigger
                  className={cn(errors.id_semillera && "border-red-500")}
                >
                  <SelectValue placeholder="Seleccionar semillera" />
                </SelectTrigger>
                <SelectContent>
                  {semilleras?.map((s) => (
                    <SelectItem
                      key={s.id_semillera}
                      value={s.id_semillera.toString()}
                    >
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_semillera && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            {/* ✅ NUEVO CAMPO: SEMILLA */}
            <div>
              <Label htmlFor="id_semilla">
                Semilla <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_semilla")?.toString()}
                onValueChange={(value) => {
                  setValue("id_semilla", Number(value));
                  // Limpiar detalles al cambiar semilla
                  setValue("detalles", []);
                }}
              >
                <SelectTrigger
                  className={cn(errors.id_semilla && "border-red-500")}
                >
                  <SelectValue placeholder="Seleccionar semilla" />
                </SelectTrigger>
                <SelectContent>
                  {semillas?.map((s) => (
                    <SelectItem
                      key={s.id_semilla}
                      value={s.id_semilla.toString()}
                    >
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_semilla && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_cliente">
                Cliente <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("id_cliente")?.toString()}
                onValueChange={(value) => setValue("id_cliente", Number(value))}
              >
                <SelectTrigger
                  className={cn(errors.id_cliente && "border-red-500")}
                >
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((c) => (
                    <SelectItem
                      key={c.id_cliente}
                      value={c.id_cliente.toString()}
                    >
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_cliente && (
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
                  className={cn(errors.id_conductor && "border-red-500")}
                >
                  <SelectValue placeholder="Seleccionar conductor" />
                </SelectTrigger>
                <SelectContent>
                  {conductores?.map((c) => (
                    <SelectItem
                      key={c.id_conductor}
                      value={c.id_conductor.toString()}
                    >
                      {c.nombre}
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
                  className={cn(errors.id_vehiculo && "border-red-500")}
                >
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehiculos?.map((v) => (
                    <SelectItem
                      key={v.id_vehiculo}
                      value={v.id_vehiculo.toString()}
                    >
                      {v.placa} - {v.marca_modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_vehiculo && (
                <p className="text-sm text-red-500 mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_salida">
                Fecha de Salida <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha_salida"
                type="date"
                {...register("fecha_salida")}
                className={errors.fecha_salida ? "border-red-500" : ""}
              />
              {errors.fecha_salida && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fecha_salida.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="deposito">Depósito</Label>
              <Input
                id="deposito"
                {...register("deposito")}
                placeholder="Depósito destino"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register("observaciones")}
              rows={3}
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        {/* Selección de Lotes */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Agregar Lotes</h2>

          {/* ✅ MENSAJE DE ADVERTENCIA */}
          {(!selectedSemilleraId || !selectedSemillaId) && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Importante:</strong> Primero debes seleccionar una{" "}
                <strong>Semillera</strong> y una <strong>Semilla</strong> para
                poder agregar lotes.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
              <Label>Seleccionar Lote Disponible</Label>
              <Select
                value={selectedLoteId?.toString()}
                onValueChange={(value) => setSelectedLoteId(Number(value))}
                disabled={!selectedSemilleraId || !selectedSemillaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedSemilleraId || !selectedSemillaId
                        ? "Primero selecciona semillera y semilla"
                        : "Seleccionar un lote"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {lotesDisponibles && lotesDisponibles.length > 0 ? (
                    lotesDisponibles.map((lote) => (
                      <SelectItem
                        key={lote.id_lote_produccion}
                        value={lote.id_lote_produccion.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{lote.nro_lote}</Badge>
                          <span>{lote.variedad?.nombre}</span>
                          <span className="text-muted-foreground">
                            ({lote.nro_bolsas} bolsas ×{" "}
                            {Number(lote.kg_por_bolsa)} kg)
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-lotes" disabled>
                      No hay lotes disponibles para esta combinación
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleAgregarLote}
              disabled={
                !selectedLoteId || !selectedSemilleraId || !selectedSemillaId
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {errors.detalles?.message && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.detalles.message}</AlertDescription>
            </Alert>
          )}

          {/* Tabla de Detalles */}
          {fields.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Variedad</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="w-32">Bolsas</TableHead>
                    <TableHead className="w-32">Kg/Bolsa</TableHead>
                    <TableHead>Total Kg</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const lote = lotesDisponibles?.find(
                      (l) => l.id_lote_produccion === field.id_lote_produccion
                    );
                    const totalKg =
                      watch(`detalles.${index}.nro_bolsas`) *
                      watch(`detalles.${index}.kg_bolsa`);
                    const excedeDisponible =
                      lote &&
                      watch(`detalles.${index}.nro_bolsas`) > lote.nro_bolsas;

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
                          <Input
                            type="number"
                            min="1"
                            {...register(`detalles.${index}.nro_bolsas`, {
                              valueAsNumber: true,
                            })}
                            className={cn(
                              "w-24",
                              excedeDisponible && "border-red-500"
                            )}
                          />
                          {excedeDisponible && (
                            <p className="text-xs text-red-500 mt-1">
                              Máx: {lote.nro_bolsas}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`detalles.${index}.kg_bolsa`, {
                              valueAsNumber: true,
                            })}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {totalKg} kg
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
          )}

          {/* Totales */}
          {fields.length > 0 && (
            <div className="mt-4 flex justify-end gap-8 text-sm">
              <div>
                <span className="text-muted-foreground">Total Bolsas:</span>
                <span className="ml-2 font-semibold">{totales.bolsas}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Kg:</span>
                <span className="ml-2 font-semibold font-mono">
                  {totales.kg.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

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
  );
}
