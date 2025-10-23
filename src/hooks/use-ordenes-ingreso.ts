import {
  getOrdenesIngreso,
  getOrdenesIngresoAll,
  getOrdenIngresoById,
  createOrdenIngreso,
  updateOrdenIngreso,
  cambiarEstadoOrdenIngreso,
  deleteOrdenIngreso,
  getOrdenesIngresoByEstado,
  getOrdenesIngresoByUnidad,
  getOrdenesIngresoByFecha,
  getEstadisticasOrdenesIngreso,
  getOrdenIngresoByNumero,
} from "@/lib/api/ordenes-ingreso";
import {
  CreateOrdenIngresoDto,
  UpdateOrdenIngresoDto,
  PaginationFilterParams,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener órdenes con paginación
export function useOrdenesIngreso(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["ordenes-ingreso", params],
    queryFn: () => getOrdenesIngreso(params),
  });
}

// Obtener todas las órdenes sin paginación
export function useOrdenesIngresoAll() {
  return useQuery({
    queryKey: ["ordenes-ingreso", "all"],
    queryFn: getOrdenesIngresoAll,
  });
}

// Obtener órdenes por estado
export function useOrdenesIngresoByEstado(estado: string) {
  return useQuery({
    queryKey: ["ordenes-ingreso", "estado", estado],
    queryFn: () => getOrdenesIngresoByEstado(estado),
    enabled: !!estado,
  });
}

// Obtener órdenes por unidad
export function useOrdenesIngresoByUnidad(idUnidad: number | null) {
  return useQuery({
    queryKey: ["ordenes-ingreso", "unidad", idUnidad],
    queryFn: () => getOrdenesIngresoByUnidad(idUnidad!),
    enabled: !!idUnidad,
  });
}

// Obtener estadísticas
export function useEstadisticasOrdenesIngreso(idUnidad?: number) {
  return useQuery({
    queryKey: ["ordenes-ingreso", "estadisticas", idUnidad],
    queryFn: () => getEstadisticasOrdenesIngreso(idUnidad),
  });
}

// Obtener una orden por id
export function useOrdenIngreso(id: number | null) {
  return useQuery({
    queryKey: ["orden-ingreso", id],
    queryFn: () => getOrdenIngresoById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear orden
export function useCreateOrdenIngreso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOrdenIngresoDto) => createOrdenIngreso(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-ingreso"] });
      toast.success("Orden de ingreso creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar orden
export function useUpdateOrdenIngreso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateOrdenIngresoDto }) =>
      updateOrdenIngreso(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-ingreso"] });
      toast.success("Orden de ingreso actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado
export function useCambiarEstadoOrdenIngreso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      cambiarEstadoOrdenIngreso(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-ingreso"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar orden
export function useDeleteOrdenIngreso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOrdenIngreso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-ingreso"] });
      toast.success("Orden de ingreso eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
