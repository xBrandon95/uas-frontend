import {
  getUnidades,
  createUnidad,
  updateUnidad,
  toggleUnidadActive,
  deleteUnidad,
  getUnidadById,
  getAllUnidades,
} from "@/lib/api/unidades";
import {
  CreateUnidadDto,
  PaginationFilterParams,
  UpdateUnidadDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUnidades(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["unidades", params],
    queryFn: () => getUnidades(params),
  });
}

export function useAllUnidades() {
  return useQuery({
    queryKey: ["unidades", "all"],
    queryFn: () => getAllUnidades(),
  });
}
export function useUnidad(id: number | null) {
  return useQuery({
    queryKey: ["unidad", id],
    queryFn: () => getUnidadById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateUnidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUnidadDto) => createUnidad(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidad creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateUnidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUnidadDto }) =>
      updateUnidad(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      queryClient.invalidateQueries({ queryKey: ["unidades", variables.id] });
      toast.success("Unidad actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useToggleUnidadActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleUnidadActive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      queryClient.invalidateQueries({ queryKey: ["unidad", id] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteUnidad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUnidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      toast.success("Unidad eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
