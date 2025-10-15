import {
  getSemillas,
  getSemillaById,
  createSemilla,
  updateSemilla,
  toggleSemillaActive,
  deleteSemilla,
  getSemillasActivas,
} from "@/lib/api/semillas";
import {
  PaginationFilterParams,
  CreateSemillaDto,
  UpdateSemillaDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener semillas paginadas
export function useSemillas(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["semillas", params],
    queryFn: () => getSemillas(params),
  });
}

// Obtener todas las semillas activas (sin paginación)
export function useSemillasActivas() {
  return useQuery({
    queryKey: ["semillas-activas"],
    queryFn: getSemillasActivas,
    staleTime: 30000,
  });
}

// Obtener una semilla por id
export function useSemilla(id: number | null) {
  return useQuery({
    queryKey: ["semilla", id],
    queryFn: () => getSemillaById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear semilla
export function useCreateSemilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateSemillaDto) => createSemilla(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semillas"] });
      queryClient.invalidateQueries({ queryKey: ["semillas-activas"] });
      toast.success("Semilla creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar semilla
export function useUpdateSemilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateSemillaDto }) =>
      updateSemilla(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semillas"] });
      queryClient.invalidateQueries({ queryKey: ["semillas-activas"] });
      toast.success("Semilla actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado (activar/desactivar)
export function useToggleSemillaActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleSemillaActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semillas"] });
      queryClient.invalidateQueries({ queryKey: ["semillas-activas"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar semilla
export function useDeleteSemilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSemilla(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semillas"] });
      queryClient.invalidateQueries({ queryKey: ["semillas-activas"] });
      toast.success("Semilla eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
