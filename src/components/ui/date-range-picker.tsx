"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Seleccionar rango de fechas",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(dateRange);

  // Sincronizar el rango interno cuando cambia el prop externo
  React.useEffect(() => {
    setInternalRange(dateRange);
  }, [dateRange]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Manejar la selección internamente sin cerrar ni hacer peticiones
  const handleDateSelect = (range: DateRange | undefined) => {
    setInternalRange(range);
  };

  // Aplicar el rango seleccionado y cerrar
  const handleApply = () => {
    onDateRangeChange(internalRange);
    setOpen(false);
  };

  // Limpiar el rango
  const handleClear = () => {
    setInternalRange(undefined);
    onDateRangeChange(undefined);
    setOpen(false);
  };

  // Manejar el cierre del popover
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Al cerrar, restaurar el valor original si no se aplicó
      setInternalRange(dateRange);
    }
    setOpen(newOpen);
  };

  const handleCancel = () => {
    setInternalRange(dateRange);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </>
              ) : (
                formatDate(dateRange.from)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={internalRange?.from || dateRange?.from}
            selected={internalRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />

          {/* Botones de acción */}
          <div className="flex items-center justify-between gap-2 p-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Limpiar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApply}
                disabled={!internalRange?.from}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
