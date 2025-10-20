import {
  getLotesProduccion,
  getLoteProduccionById,
  createLoteProduccion,
  updateLoteProduccion,
  cambiarEstadoLote,
  deleteLoteProduccion,
  getLotesDisponibles,
  getLotesByEstado,
  getLotesByUnidad,
  getLotesByVariedad,
  getLotesByOrdenIngreso,
  getInventarioVariedad,
  getEstadisticasLotes,
} from "@/lib/api/lotes-produccion";
import { CreateLoteProduccionDto, UpdateLoteProduccionDto } from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener todos los lotes
export function useLotesProduccion() {
  return useQuery({
    queryKey: ["lotes-produccion"],
    queryFn: getLotesProduccion,
  });
}

// Obtener lotes disponibles
export function useLotesDisponibles() {
  return useQuery({
    queryKey: ["lotes-produccion", "disponibles"],
    queryFn: getLotesDisponibles,
  });
}

// Obtener lotes por estado
export function useLotesByEstado(estado: string) {
  return useQuery({
    queryKey: ["lotes-produccion", "estado", estado],
    queryFn: () => getLotesByEstado(estado),
    enabled: !!estado,
  });
}

// Obtener lotes por unidad
export function useLotesByUnidad(idUnidad: number | null) {
  return useQuery({
    queryKey: ["lotes-produccion", "unidad", idUnidad],
    queryFn: () => getLotesByUnidad(idUnidad!),
    enabled: !!idUnidad,
  });
}

// Obtener lotes por variedad
export function useLotesByVariedad(idVariedad: number | null) {
  return useQuery({
    queryKey: ["lotes-produccion", "variedad", idVariedad],
    queryFn: () => getLotesByVariedad(idVariedad!),
    enabled: !!idVariedad,
  });
}

// Obtener lotes por orden de ingreso
export function useLotesByOrdenIngreso(idOrdenIngreso: number | null) {
  return useQuery({
    queryKey: ["lotes-produccion", "orden-ingreso", idOrdenIngreso],
    queryFn: () => getLotesByOrdenIngreso(idOrdenIngreso!),
    enabled: !!idOrdenIngreso,
  });
}

// Obtener inventario por variedad
export function useInventarioVariedad(idUnidad?: number) {
  return useQuery({
    queryKey: ["lotes-produccion", "inventario", idUnidad],
    queryFn: () => getInventarioVariedad(idUnidad),
  });
}

// Obtener estadísticas
export function useEstadisticasLotes(idUnidad?: number) {
  return useQuery({
    queryKey: ["lotes-produccion", "estadisticas", idUnidad],
    queryFn: () => getEstadisticasLotes(idUnidad),
  });
}

// Obtener un lote por id
export function useLoteProduccion(id: number | null) {
  return useQuery({
    queryKey: ["lote-produccion", id],
    queryFn: () => getLoteProduccionById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear lote
export function useCreateLoteProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateLoteProduccionDto) => createLoteProduccion(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      queryClient.invalidateQueries({ queryKey: ["ordenes-ingreso"] });
      toast.success("Lote de producción creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar lote
export function useUpdateLoteProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateLoteProduccionDto }) =>
      updateLoteProduccion(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      toast.success("Lote de producción actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado
export function useCambiarEstadoLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      cambiarEstadoLote(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar lote
export function useDeleteLoteProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLoteProduccion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes-produccion"] });
      toast.success("Lote de producción eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
