// src/components/ordenes-ingreso/form/SemillaSection.tsx
import { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useSemillasActivas } from "@/hooks/use-semillas";
import { useVariedadesBySemilla } from "@/hooks/use-variedades";
import { useCategoriasActivas } from "@/hooks/use-categorias";

interface SemillaSectionProps {
  form: UseFormReturn<CreateOrdenFormData>;
  dialogs: {
    semilla: { open: boolean; setOpen: (open: boolean) => void };
    variedad: { open: boolean; setOpen: (open: boolean) => void };
    categoria: { open: boolean; setOpen: (open: boolean) => void };
  };
}

export function SemillaSection({ form, dialogs }: SemillaSectionProps) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Cargar datos
  const { data: semillas } = useSemillasActivas();
  const { data: categorias } = useCategoriasActivas();

  const selectedSemillaId = watch("id_semilla");
  const { data: variedades } = useVariedadesBySemilla(
    selectedSemillaId || null
  );

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Semilla</h2>

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
              onClick={() => dialogs.semilla.setOpen(true)}
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
              onClick={() => dialogs.variedad.setOpen(true)}
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
              onClick={() => dialogs.categoria.setOpen(true)}
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

        {/* NRO LOTE CAMPO */}
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

        {/* NRO CUPON */}
        <div>
          <Label htmlFor="nro_cupon">
            Nº Cupón<span className="text-red-500">*</span>
          </Label>
          <Input
            id="nro_cupon"
            {...register("nro_cupon")}
            className={errors.nro_cupon ? "border-red-500" : ""}
          />
          {errors.nro_cupon && (
            <p className="text-sm text-red-500 mt-1">Campo requerido</p>
          )}
        </div>
      </div>
    </div>
  );
}
