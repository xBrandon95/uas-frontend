import api from "@/lib/axios";
import { Semillera, CreateSemilleraDto, UpdateSemilleraDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener semilleras paginadas
export async function getSemilleras(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Semillera>> {
  const { data } = await api.get("/semilleras", { params });
  return data;
}

// Obtener todas las semilleras activas (sin paginación)
export async function getSemillerasActivas(): Promise<Semillera[]> {
  const { data } = await api.get("/semilleras/activas");
  return data;
}

// Obtener semillera por id
export async function getSemilleraById(id: number): Promise<Semillera> {
  const { data } = await api.get(`/semilleras/${id}`);
  return data;
}

// Crear semillera
export async function createSemillera(
  dto: CreateSemilleraDto
): Promise<Semillera> {
  const { data } = await api.post("/semilleras", dto);
  return data;
}

// Actualizar semillera
export async function updateSemillera(
  id: number,
  dto: UpdateSemilleraDto
): Promise<Semillera> {
  const { data } = await api.patch(`/semilleras/${id}`, dto);
  return data;
}

// Cambiar estado
export async function toggleSemilleraActive(id: number): Promise<Semillera> {
  const { data } = await api.patch(`/semilleras/${id}/toggle-active`);
  return data;
}

// Eliminar semillera
export async function deleteSemillera(id: number): Promise<void> {
  await api.delete(`/semilleras/${id}`);
}
