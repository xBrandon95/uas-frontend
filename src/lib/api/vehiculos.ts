import api from "@/lib/axios";
import { Vehiculo, CreateVehiculoDto, UpdateVehiculoDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener vehículos paginados
export async function getVehiculos(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Vehiculo>> {
  const { data } = await api.get("/vehiculos", { params });
  return data;
}

// Obtener todos los vehículos activos (sin paginación)
export async function getVehiculosActivos(): Promise<Vehiculo[]> {
  const { data } = await api.get("/vehiculos/activos");
  return data;
}

// Obtener vehículo por id
export async function getVehiculoById(id: number): Promise<Vehiculo> {
  const { data } = await api.get(`/vehiculos/${id}`);
  return data;
}

// Crear vehículo
export async function createVehiculo(
  dto: CreateVehiculoDto
): Promise<Vehiculo> {
  const { data } = await api.post("/vehiculos", dto);
  return data;
}

// Actualizar vehículo
export async function updateVehiculo(
  id: number,
  dto: UpdateVehiculoDto
): Promise<Vehiculo> {
  const { data } = await api.patch(`/vehiculos/${id}`, dto);
  return data;
}

// Eliminar vehículo
export async function deleteVehiculo(id: number): Promise<void> {
  await api.delete(`/vehiculos/${id}`);
}
