import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  toggleServicioActive,
  deleteServicio,
  getServiciosActivos,
} from "@/lib/api/servicios";
import {
  PaginationFilterParams,
  CreateServicioDto,
  UpdateServicioDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener servicios paginados
export function useServicios(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["servicios", params],
    queryFn: () => getServicios(params),
  });
}

// Obtener todos los servicios activos (sin paginación)
export function useServiciosActivos() {
  return useQuery({
    queryKey: ["servicios-activos"],
    queryFn: getServiciosActivos,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// Obtener un servicio por id
export function useServicio(id: number | null) {
  return useQuery({
    queryKey: ["servicio", id],
    queryFn: () => getServicioById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear servicio
export function useCreateServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateServicioDto) => createServicio(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-activos"] });
      toast.success("Servicio creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar servicio
export function useUpdateServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateServicioDto }) =>
      updateServicio(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-activos"] });
      queryClient.invalidateQueries({ queryKey: ["servicio", variables.id] });
      toast.success("Servicio actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Cambiar estado (activar/desactivar)
export function useToggleServicioActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleServicioActive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-activos"] });
      queryClient.invalidateQueries({ queryKey: ["servicio", id] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar servicio
export function useDeleteServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteServicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-activos"] });
      toast.success("Servicio eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
