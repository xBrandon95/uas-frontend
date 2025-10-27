// src/components/ordenes-ingreso/form/TransporteSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateOrdenFormData } from "../schemas/ordenIngresoSchema";
import { useSemillerasActivas } from "@/hooks/use-semilleras";
import { useCooperadores } from "@/hooks/use-cooperadores";
import { useConductoresActivos } from "@/hooks/use-conductores";
import { useVehiculosActivos } from "@/hooks/use-vehiculos";

interface TransporteSectionProps {
  form: UseFormReturn<CreateOrdenFormData>;
  dialogs: {
    semillera: { open: boolean; setOpen: (open: boolean) => void };
    cooperador: { open: boolean; setOpen: (open: boolean) => void };
    conductor: { open: boolean; setOpen: (open: boolean) => void };
    vehiculo: { open: boolean; setOpen: (open: boolean) => void };
  };
}

export function TransporteSection({ form, dialogs }: TransporteSectionProps) {
  const {
    control,
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

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Transporte</h2>

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
              onClick={() => dialogs.semillera.setOpen(true)}
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
              onClick={() => dialogs.cooperador.setOpen(true)}
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
                        {conductor.nombre} - <strong>CI:</strong> {conductor.ci}
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
              onClick={() => dialogs.conductor.setOpen(true)}
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
              onClick={() => dialogs.vehiculo.setOpen(true)}
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
