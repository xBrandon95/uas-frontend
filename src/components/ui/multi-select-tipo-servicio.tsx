"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

const TIPOS_SERVICIO = [
  { value: "tratamiento_premium", label: "Tratamiento Premium" },
  { value: "fumigacion", label: "Fumigación" },
  { value: "clasificacion", label: "Clasificación" },
  { value: "secado", label: "Secado" },
  { value: "limpieza", label: "Limpieza" },
  { value: "desinfeccion", label: "Desinfección" },
];

interface MultiSelectTipoServicioProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function MultiSelectTipoServicio({
  value,
  onChange,
  error,
}: MultiSelectTipoServicioProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

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
    const stringValue = newValues.join(", ");
    onChange(stringValue);
  };

  const handleRemove = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== itemValue);
    setSelectedValues(newValues);
    onChange(newValues.join(", "));
  };

  const getLabel = (val: string) => {
    const item = TIPOS_SERVICIO.find((t) => t.value === val);
    return item ? item.label : val;
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border ${
          error ? "border-red-500" : "border-input"
        } bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
          {selectedValues.length > 0 ? (
            <>
              {selectedValues.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                >
                  {getLabel(val)}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-blue-600"
                    onClick={(e) => handleRemove(val, e)}
                  />
                </span>
              ))}
            </>
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
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                {selectedValues.length > 0
                  ? `${selectedValues.length} servicio(s) seleccionado(s)`
                  : "Selecciona uno o más servicios"}
              </div>
              {TIPOS_SERVICIO.map((item) => {
                const isSelected = selectedValues.includes(item.value);
                return (
                  <div
                    key={item.value}
                    onClick={() => handleToggle(item.value)}
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
                    <span className={isSelected ? "font-medium" : ""}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
