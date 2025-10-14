import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  toggleUsuarioActive,
  deleteUsuario,
  getUsuarioById,
  getUsuariosByUnidad,
} from "@/lib/api/usuarios";
import {
  CreateUsuarioDto,
  PaginationFilterParams,
  UpdateUsuarioDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsuarios(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["usuarios", params],
    queryFn: () => getUsuarios(params),
  });
}

export function useUsuario(id: number | null) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => getUsuarioById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useUsuariosByUnidad(unidadId: number | null) {
  return useQuery({
    queryKey: ["usuarios", "unidad", unidadId],
    queryFn: () => getUsuariosByUnidad(unidadId!),
    enabled: !!unidadId,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUsuarioDto) => createUsuario(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUsuarioDto }) =>
      updateUsuario(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useToggleUsuarioActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleUsuarioActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
