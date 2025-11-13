"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiciosActivos } from "@/hooks/use-servicios";
import { useAuthStore } from "@/stores/authStore";

interface MultiSelectTipoServicioDinamicoProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  onCreateNew?: () => void;
}

export function MultiSelectTipoServicioDinamico({
  value,
  onChange,
  error,
  onCreateNew,
}: MultiSelectTipoServicioDinamicoProps) {
  const { user } = useAuthStore();
  const puedeCrearServicios =
    user?.rol === "admin" || user?.rol === "encargado";

  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const { data: servicios, isLoading } = useServiciosActivos();

  useEffect(() => {
    if (value && typeof value === "string") {
      const values = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      setSelectedValues(values);
    } else if (!value) {
      setSelectedValues([]);
    }
  }, [value]);

  const handleToggle = (itemValue: string) => {
    let newValues: string[];

    if (selectedValues.includes(itemValue)) {
      newValues = selectedValues.filter((v) => v !== itemValue);
    } else {
      newValues = [...selectedValues, itemValue];
    }

    setSelectedValues(newValues);
    onChange(newValues.join(", "));
  };

  const handleRemove = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== itemValue);
    setSelectedValues(newValues);
    onChange(newValues.join(", "));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange("");
  };

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Cargando servicios...
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border ${
          error ? "border-red-500" : "border-input"
        } bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
      >
        <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
              >
                {val}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-blue-600"
                  onClick={(e) => handleRemove(val, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">
              Seleccionar servicios...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {selectedValues.length > 0 && (
            <X
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            />
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none max-h-64 overflow-auto">
            <div className="p-1">
              {/* Botón para crear nuevo servicio */}
              {onCreateNew && puedeCrearServicios && (
                <div className="p-2 border-b">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      onCreateNew();
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Crear nuevo servicio
                  </Button>
                </div>
              )}

              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                {selectedValues.length > 0
                  ? `${selectedValues.length} servicio(s) seleccionado(s)`
                  : "Selecciona uno o más servicios"}
              </div>

              {servicios && servicios.length > 0 ? (
                servicios.map((servicio) => {
                  const isSelected = selectedValues.includes(servicio.nombre);
                  return (
                    <div
                      key={servicio.id_servicio}
                      onClick={() => handleToggle(servicio.nombre)}
                      className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                        isSelected ? "bg-accent" : ""
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-input"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={isSelected ? "font-medium" : ""}>
                          {servicio.nombre}
                        </span>
                        {servicio.descripcion && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {servicio.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No hay servicios disponibles.
                  {onCreateNew && (
                    <>
                      <br />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(false);
                          onCreateNew();
                        }}
                        className="text-primary underline mt-2 hover:text-primary/80"
                      >
                        Crear el primero
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
