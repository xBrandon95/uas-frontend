import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClientesActivos,
} from "@/lib/api/clientes";
import {
  PaginationFilterParams,
  CreateClienteDto,
  UpdateClienteDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener clientes paginados
export function useClientes(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["clientes", params],
    queryFn: () => getClientes(params),
  });
}

// Obtener todos los clientes activos (sin paginación)
export function useClientesActivos() {
  return useQuery({
    queryKey: ["clientes-activos"],
    queryFn: getClientesActivos,
    staleTime: 30000,
  });
}

// Obtener un cliente por id
export function useCliente(id: number | null) {
  return useQuery({
    queryKey: ["cliente", id],
    queryFn: () => getClienteById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear cliente
export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClienteDto) => createCliente(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes-activos"] });
      toast.success("Cliente creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar cliente
export function useUpdateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateClienteDto }) =>
      updateCliente(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes-activos"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", variables.id] });
      toast.success("Cliente actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar cliente
export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes-activos"] });
      toast.success("Cliente eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
