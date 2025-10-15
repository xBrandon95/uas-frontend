import api from "@/lib/axios";
import { Conductor, CreateConductorDto, UpdateConductorDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener conductores paginados
export async function getConductores(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Conductor>> {
  const { data } = await api.get("/conductores", { params });
  return data;
}

// Obtener todos los conductores activos (sin paginación)
export async function getConductoresActivos(): Promise<Conductor[]> {
  const { data } = await api.get("/conductores/activos");
  return data;
}

// Obtener conductor por id
export async function getConductorById(id: number): Promise<Conductor> {
  const { data } = await api.get(`/conductores/${id}`);
  return data;
}

// Crear conductor
export async function createConductor(
  dto: CreateConductorDto
): Promise<Conductor> {
  const { data } = await api.post("/conductores", dto);
  return data;
}

// Actualizar conductor
export async function updateConductor(
  id: number,
  dto: UpdateConductorDto
): Promise<Conductor> {
  const { data } = await api.patch(`/conductores/${id}`, dto);
  return data;
}

// Eliminar conductor
export async function deleteConductor(id: number): Promise<void> {
  await api.delete(`/conductores/${id}`);
}
