import {
  getVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
  getVehiculosActivos,
} from "@/lib/api/vehiculos";
import {
  PaginationFilterParams,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Obtener vehículos paginados
export function useVehiculos(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["vehiculos", params],
    queryFn: () => getVehiculos(params),
  });
}

// Obtener todos los vehículos activos (sin paginación)
export function useVehiculosActivos() {
  return useQuery({
    queryKey: ["vehiculos-activos"],
    queryFn: getVehiculosActivos,
    staleTime: 30000,
  });
}

// Obtener un vehículo por id
export function useVehiculo(id: number | null) {
  return useQuery({
    queryKey: ["vehiculo", id],
    queryFn: () => getVehiculoById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

// Crear vehículo
export function useCreateVehiculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateVehiculoDto) => createVehiculo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculos-activos"] });
      toast.success("Vehículo creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Actualizar vehículo
export function useUpdateVehiculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateVehiculoDto }) =>
      updateVehiculo(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculos-activos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculo", variables.id] });
      toast.success("Vehículo actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Eliminar vehículo
export function useDeleteVehiculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVehiculo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculos-activos"] });
      toast.success("Vehículo eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
