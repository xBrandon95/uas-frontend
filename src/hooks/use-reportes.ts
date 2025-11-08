import { useMutation } from "@tanstack/react-query";
import {
  descargarReporteOrdenIngreso,
  descargarReporteOrdenSalida,
  descargarReporteInventarioConsolidado,
} from "@/lib/api/reportes";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";

export function useDescargarReporteOrdenIngreso() {
  return useMutation({
    mutationFn: (id: number) => descargarReporteOrdenIngreso(id),
    onSuccess: () => {
      toast.success("Reporte descargado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDescargarReporteOrdenSalida() {
  return useMutation({
    mutationFn: (id: number) => descargarReporteOrdenSalida(id),
    onSuccess: () => {
      toast.success("Reporte descargado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

interface FiltrosInventario {
  idUnidad?: number;
  idSemilla?: number;
  idVariedad?: number;
  idCategoria?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export function useDescargarReporteInventarioConsolidado() {
  return useMutation({
    mutationFn: (filtros: FiltrosInventario) =>
      descargarReporteInventarioConsolidado(filtros),
    onSuccess: () => {
      toast.success("Reporte de inventario descargado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
