import {
  getSemilleras,
  getSemilleraById,
  createSemillera,
  updateSemillera,
  toggleSemilleraActive,
  deleteSemillera,
  getSemillerasActivas,
} from "@/lib/api/semilleras";
import {
  PaginationFilterParams,
  CreateSemilleraDto,
  UpdateSemilleraDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener semilleras paginadas
export function useSemilleras(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["semilleras", params],
    queryFn: () => getSemilleras(params),
  });
}

// Obtener todas las semilleras activas (sin paginación)
export function useSemillerasActivas() {
  return useQuery({
    queryKey: ["semilleras-activas"],
    queryFn: getSemillerasActivas,
    staleTime: 30000,
  });
}

// Obtener una semillera por id
export function useSemillera(id: number | null) {
  return useQuery({
    queryKey: ["semillera", id],
    queryFn: () => getSemilleraById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear semillera
export function useCreateSemillera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateSemilleraDto) => createSemillera(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semilleras"] });
      queryClient.invalidateQueries({ queryKey: ["semilleras-activas"] });
      toast.success("Semillera creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar semillera
export function useUpdateSemillera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateSemilleraDto }) =>
      updateSemillera(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semilleras"] });
      queryClient.invalidateQueries({ queryKey: ["semilleras-activas"] });
      toast.success("Semillera actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado (activar/desactivar)
export function useToggleSemilleraActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleSemilleraActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semilleras"] });
      queryClient.invalidateQueries({ queryKey: ["semilleras-activas"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar semillera
export function useDeleteSemillera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSemillera(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semilleras"] });
      queryClient.invalidateQueries({ queryKey: ["semilleras-activas"] });
      toast.success("Semillera eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
