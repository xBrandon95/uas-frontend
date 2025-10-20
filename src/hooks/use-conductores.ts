import {
  getConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor,
  getConductoresActivos,
} from "@/lib/api/conductores";
import {
  PaginationFilterParams,
  CreateConductorDto,
  UpdateConductorDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener conductores paginados
export function useConductores(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["conductores", params],
    queryFn: () => getConductores(params),
  });
}

// Obtener todos los conductores activos (sin paginación)
export function useConductoresActivos() {
  return useQuery({
    queryKey: ["conductores-activos"],
    queryFn: getConductoresActivos,
    staleTime: 30000,
  });
}

// Obtener un conductor por id
export function useConductor(id: number | null) {
  return useQuery({
    queryKey: ["conductor", id],
    queryFn: () => getConductorById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear conductor
export function useCreateConductor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateConductorDto) => createConductor(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
      queryClient.invalidateQueries({ queryKey: ["conductores-activos"] });
      toast.success("Conductor creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar conductor
export function useUpdateConductor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateConductorDto }) =>
      updateConductor(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
      queryClient.invalidateQueries({ queryKey: ["conductores-activos"] });
      queryClient.invalidateQueries({
        queryKey: ["conductor", variables.id],
      });
      toast.success("Conductor actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar conductor
export function useDeleteConductor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteConductor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
      queryClient.invalidateQueries({ queryKey: ["conductores-activos"] });
      toast.success("Conductor eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
