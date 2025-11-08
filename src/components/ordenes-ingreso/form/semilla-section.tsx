// src/components/ordenes-ingreso/form/semilla-section.tsx
"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateOrdenFormData } from "../schemas/ordenIngresoSchema";
import { useSemillasActivas } from "@/hooks/use-semillas";
import { useVariedadesBySemilla } from "@/hooks/use-variedades";
import { useCategoriasActivas } from "@/hooks/use-categorias";
import { Combobox } from "@/components/ui/combobox";
import { useMemo } from "react";

interface SemillaSectionProps {
  form: UseFormReturn<CreateOrdenFormData>;
  dialogs: {
    semilla: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
    variedad: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
    categoria: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
      setOnCreated: (callback: ((id: number) => void) | null) => void;
    };
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

  // --- Cargar datos ---
  const { data: semillas } = useSemillasActivas();
  const { data: categorias } = useCategoriasActivas();

  const selectedSemillaId = watch("id_semilla");

  const { data: variedades } = useVariedadesBySemilla(
    selectedSemillaId || null
  );

  // --- Opciones para Combobox ---
  const semillasOptions = useMemo(
    () =>
      semillas?.map((s) => ({
        value: s.id_semilla.toString(),
        label: s.nombre,
      })) || [],
    [semillas]
  );

  const variedadesOptions = useMemo(
    () =>
      variedades?.map((v) => ({
        value: v.id_variedad.toString(),
        label: v.nombre,
      })) || [],
    [variedades]
  );

  const categoriasOptions = useMemo(
    () =>
      categorias?.map((c) => ({
        value: c.id_categoria.toString(),
        label: c.nombre,
      })) || [],
    [categorias]
  );

  // Handlers para abrir diálogos con callbacks
  const handleOpenSemilla = () => {
    dialogs.semilla.setOnCreated((id: number) => {
      setValue("id_semilla", id);
      setValue("id_variedad", undefined as any); // Reset variedad
      dialogs.semilla.setOnCreated(null);
    });
    dialogs.semilla.setOpen(true);
  };

  const handleOpenVariedad = () => {
    dialogs.variedad.setOnCreated((id: number) => {
      setValue("id_variedad", id);
      dialogs.variedad.setOnCreated(null);
    });
    dialogs.variedad.setOpen(true);
  };

  const handleOpenCategoria = () => {
    dialogs.categoria.setOnCreated((id: number) => {
      setValue("id_categoria_ingreso", id);
      dialogs.categoria.setOnCreated(null);
    });
    dialogs.categoria.setOpen(true);
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Información de Semilla</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ---------------- SEMILLA ---------------- */}
        <div>
          <Label>
            Semilla <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2 mt-2 items-start">
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
                    setValue("id_variedad", undefined as any);
                  }}
                  placeholder="Buscar semilla..."
                  searchPlaceholder="Escriba para buscar..."
                  emptyText="No se encontraron semillas"
                  error={!!errors.id_semilla}
                  className="flex-1"
                />
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenSemilla}
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

        {/* ---------------- VARIEDAD ---------------- */}
        <div>
          <Label>
            Variedad <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_variedad"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={variedadesOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Buscar variedad..."
                  searchPlaceholder="Escriba para buscar..."
                  emptyText="No se encontraron variedades"
                  disabled={!selectedSemillaId}
                  error={!!errors.id_variedad}
                  className="flex-1"
                />
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenVariedad}
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

        {/* ---------------- CATEGORÍA ---------------- */}
        <div>
          <Label>
            Categoría <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-2 mt-2 items-start">
            <Controller
              name="id_categoria_ingreso"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <Combobox
                  options={categoriasOptions}
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Buscar categoría..."
                  searchPlaceholder="Escriba para buscar..."
                  emptyText="No se encontraron categorías"
                  error={!!errors.id_categoria_ingreso}
                  className="flex-1"
                />
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenCategoria}
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

        {/* ---------------- NRO LOTE CAMPO ---------------- */}
        <div>
          <Label>
            Nº Lote Campo <span className="text-red-500">*</span>
          </Label>

          <Input
            {...register("nro_lote_campo")}
            className={errors.nro_lote_campo ? "border-red-500" : ""}
          />

          {errors.nro_lote_campo && (
            <p className="text-sm text-red-500 mt-1">Campo requerido</p>
          )}
        </div>

        {/* ---------------- NRO CUPÓN ---------------- */}
        <div>
          <Label>
            Nº Cupón <span className="text-red-500">*</span>
          </Label>

          <Input
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
