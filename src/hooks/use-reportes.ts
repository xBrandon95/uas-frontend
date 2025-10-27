import { useMutation } from "@tanstack/react-query";
import {
  descargarReporteOrdenIngreso,
  descargarReporteOrdenSalida,
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
