import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasActivas,
} from "@/lib/api/categorias";
import {
  PaginationFilterParams,
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener categorías paginadas
export function useCategorias(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["categorias", params],
    queryFn: () => getCategorias(params),
  });
}

// Obtener todas las categorías activas (sin paginación)
export function useCategoriasActivas() {
  return useQuery({
    queryKey: ["categorias-activas"],
    queryFn: getCategoriasActivas,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// Obtener una categoría por id
export function useCategoria(id: number | null) {
  return useQuery({
    queryKey: ["categoria", id],
    queryFn: () => getCategoriaById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear categoría
export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoriaDto) => createCategoria(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-activas"] });
      toast.success("Categoría creada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar categoría
export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoriaDto }) =>
      updateCategoria(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-activas"] });
      queryClient.invalidateQueries({ queryKey: ["categoria", variables.id] });
      toast.success("Categoría actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar categoría
export function useDeleteCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-activas"] });
      toast.success("Categoría eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
