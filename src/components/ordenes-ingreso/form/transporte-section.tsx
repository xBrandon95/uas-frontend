// src/components/ordenes-ingreso/form/transporte-section.tsx
"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateOrdenFormData } from "../schemas/ordenIngresoSchema";
import { useSemillerasActivas } from "@/hooks/use-semilleras";
import { useCooperadores } from "@/hooks/use-cooperadores";
import { useConductoresActivos } from "@/hooks/use-conductores";
import { useVehiculosActivos } from "@/hooks/use-vehiculos";
import { Combobox } from "@/components/ui/combobox";
import { useMemo } from "react";

interface TransporteSectionProps {
  form: UseFormReturn<CreateOrdenFormData>;
  dialogs: {
    semillera: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
    cooperador: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
    conductor: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
    vehiculo: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
  };
}

export function TransporteSection({ form, dialogs }: TransporteSectionProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = form;

  // Cargar datos
  const { data: semilleras } = useSemillerasActivas();
  const { data: cooperadores } = useCooperadores({
    page: 1,
    limit: 100,
    search: "",
  });
  const { data: conductores } = useConductoresActivos();
  const { data: vehiculos } = useVehiculosActivos();

  // Opciones Combobox
  const semillerasOptions = useMemo(
    () =>
      semilleras?.map((s) => ({
        value: s.id_semillera.toString(),
        label: s.nombre,
      })) || [],
    [semilleras]
  );

  const cooperadoresOptions = useMemo(
    () =>
      cooperadores?.data?.map((c) => ({
        value: c.id_cooperador.toString(),
        label: c.nombre,
        sublabel: c.ci ? `CI: ${c.ci}` : undefined,
      })) || [],
    [cooperadores]
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

  // Handlers para abrir diálogos con callbacks
  const handleOpenSemillera = () => {
    dialogs.semillera.setOnCreated((id: number) => {
      setValue("id_semillera", id);
      dialogs.semillera.setOnCreated(null);
    });
    dialogs.semillera.setOpen(true);
  };

  const handleOpenCooperador = () => {
    dialogs.cooperador.setOnCreated((id: number) => {
      setValue("id_cooperador", id);
      dialogs.cooperador.setOnCreated(null);
    });
    dialogs.cooperador.setOpen(true);
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

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Transporte</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SEMILLERA */}
        <div>
          <Label htmlFor="id_semillera">
            Semillera <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_semillera"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={semillerasOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Buscar semillera..."
                  searchPlaceholder="Escriba para buscar..."
                  emptyText="No se encontraron semilleras"
                  error={!!errors.id_semillera}
                  className="flex-1"
                />
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenSemillera}
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

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_cooperador"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={cooperadoresOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Buscar cooperador..."
                  searchPlaceholder="Escriba para buscar..."
                  emptyText="No se encontraron cooperadores"
                  error={!!errors.id_cooperador}
                  className="flex-1"
                />
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenCooperador}
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

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_conductor"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={conductoresOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
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

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_vehiculo"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={vehiculosOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
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
            <p className="text-sm text-red-500 mt-1">
              {errors.id_vehiculo.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
