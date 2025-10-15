import api from "@/lib/axios";
import { Semilla, CreateSemillaDto, UpdateSemillaDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener semillas paginadas
export async function getSemillas(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Semilla>> {
  const { data } = await api.get("/semillas", { params });
  return data;
}

// Obtener todas las semillas activas (sin paginación)
export async function getSemillasActivas(): Promise<Semilla[]> {
  const { data } = await api.get("/semillas/activas");
  return data;
}

// Obtener semilla por id
export async function getSemillaById(id: number): Promise<Semilla> {
  const { data } = await api.get(`/semillas/${id}`);
  return data;
}

// Crear semilla
export async function createSemilla(dto: CreateSemillaDto): Promise<Semilla> {
  const { data } = await api.post("/semillas", dto);
  return data;
}

// Actualizar semilla
export async function updateSemilla(
  id: number,
  dto: UpdateSemillaDto
): Promise<Semilla> {
  const { data } = await api.patch(`/semillas/${id}`, dto);
  return data;
}

// Cambiar estado
export async function toggleSemillaActive(id: number): Promise<Semilla> {
  const { data } = await api.patch(`/semillas/${id}/toggle-active`);
  return data;
}

// Eliminar semilla
export async function deleteSemilla(id: number): Promise<void> {
  await api.delete(`/semillas/${id}`);
}
