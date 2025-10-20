import {
  getVariedades,
  getVariedadById,
  createVariedad,
  updateVariedad,
  deleteVariedad,
  getVariedadesActivas,
  getVariedadesBySemilla,
} from "@/lib/api/variedades";
import {
  PaginationFilterParams,
  CreateVariedadDto,
  UpdateVariedadDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener variedades paginadas
export function useVariedades(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["variedades", params],
    queryFn: () => getVariedades(params),
  });
}

// Obtener todas las variedades activas (sin paginación)
export function useVariedadesActivas() {
  return useQuery({
    queryKey: ["variedades-activas"],
    queryFn: getVariedadesActivas,
    staleTime: 30000,
  });
}

// Obtener variedades por semilla
export function useVariedadesBySemilla(idSemilla: number | null) {
  return useQuery({
    queryKey: ["variedades-semilla", idSemilla],
    queryFn: () => getVariedadesBySemilla(idSemilla!),
    enabled: !!idSemilla,
    staleTime: 30000,
  });
}

// Obtener una variedad por id
export function useVariedad(id: number | null) {
  return useQuery({
    queryKey: ["variedad", id],
    queryFn: () => getVariedadById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear variedad
export function useCreateVariedad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateVariedadDto) => createVariedad(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variedades"] });
      queryClient.invalidateQueries({ queryKey: ["variedades-activas"] });
      queryClient.invalidateQueries({ queryKey: ["variedades-semilla"] });
      toast.success("Variedad creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar variedad
export function useUpdateVariedad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateVariedadDto }) =>
      updateVariedad(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["variedades"] });
      queryClient.invalidateQueries({ queryKey: ["variedades-activas"] });
      queryClient.invalidateQueries({ queryKey: ["variedad", variables.id] });
      toast.success("Variedad actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar variedad
export function useDeleteVariedad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVariedad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variedades"] });
      queryClient.invalidateQueries({ queryKey: ["variedades-activas"] });
      queryClient.invalidateQueries({ queryKey: ["variedades-semilla"] });
      toast.success("Variedad eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
