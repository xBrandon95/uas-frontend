import {
  getOrdenesSalida,
  getOrdenSalidaById,
  createOrdenSalida,
  updateOrdenSalida,
  cambiarEstadoOrdenSalida,
  deleteOrdenSalida,
  getOrdenesSalidaByEstado,
  getOrdenesSalidaByUnidad,
  getEstadisticasOrdenesSalida,
  getLotesDisponiblesParaOrden,
  getLotesDisponiblesFiltrados, // ✅ NUEVO
} from "@/lib/api/ordenes-salida";
import {
  CreateOrdenSalidaDto,
  PaginationFilterParams,
  UpdateOrdenSalidaDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener todas las órdenes
export function useOrdenesSalida(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["ordenes-salida", params],
    queryFn: () => getOrdenesSalida(params),
  });
}

// ✅ NUEVO: Hook para obtener lotes filtrados
export function useLotesDisponiblesFiltrados(
  idSemillera: number | null,
  idSemilla: number | null
) {
  return useQuery({
    queryKey: ["ordenes-salida", "lotes-filtrados", idSemillera, idSemilla],
    queryFn: () => getLotesDisponiblesFiltrados(idSemillera!, idSemilla!),
    enabled: !!idSemillera && !!idSemilla,
    staleTime: 30000,
  });
}

// Hook original (mantener por compatibilidad)
export function useLotesDisponiblesParaOrden() {
  return useQuery({
    queryKey: ["ordenes-salida", "lotes-disponibles"],
    queryFn: getLotesDisponiblesParaOrden,
  });
}

// Obtener órdenes por estado
export function useOrdenesSalidaByEstado(estado: string) {
  return useQuery({
    queryKey: ["ordenes-salida", "estado", estado],
    queryFn: () => getOrdenesSalidaByEstado(estado),
    enabled: !!estado,
  });
}

// Obtener órdenes por unidad
export function useOrdenesSalidaByUnidad(idUnidad: number | null) {
  return useQuery({
    queryKey: ["ordenes-salida", "unidad", idUnidad],
    queryFn: () => getOrdenesSalidaByUnidad(idUnidad!),
    enabled: !!idUnidad,
  });
}

// Obtener estadísticas
export function useEstadisticasOrdenesSalida(idUnidad?: number) {
  return useQuery({
    queryKey: ["ordenes-salida", "estadisticas", idUnidad],
    queryFn: () => getEstadisticasOrdenesSalida(idUnidad),
  });
}

// Obtener una orden por id
export function useOrdenSalida(id: number | null) {
  return useQuery({
    queryKey: ["orden-salida", id],
    queryFn: () => getOrdenSalidaById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear orden
export function useCreateOrdenSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOrdenSalidaDto) => createOrdenSalida(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-salida"] });
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      toast.success("Orden de salida creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar orden
export function useUpdateOrdenSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateOrdenSalidaDto }) =>
      updateOrdenSalida(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-salida"] });
      toast.success("Orden de salida actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado
export function useCambiarEstadoOrdenSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      cambiarEstadoOrdenSalida(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-salida"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar orden
export function useDeleteOrdenSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOrdenSalida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-salida"] });
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      toast.success("Orden de salida eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
