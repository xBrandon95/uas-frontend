import api from "@/lib/axios";
import { Unidad } from "@/types";
import {
  PaginationFilterParams,
  PaginatedResponse,
  CreateUnidadDto,
  UpdateUnidadDto,
} from "@/types";

// Obtener unidades paginadas
export async function getUnidades(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Unidad>> {
  const { data } = await api.get("/unidades", { params });
  console.log(data);
  return data;
}

// Obtener todas las unidades activas sin paginación
export async function getAllUnidades(): Promise<Unidad[]> {
  const { data } = await api.get("/unidades/all");
  return data;
}

// Obtener unidad por id
export async function getUnidadById(id: number): Promise<Unidad> {
  const { data } = await api.get(`/unidades/${id}`);
  return data;
}

// Crear unidad
export async function createUnidad(dto: CreateUnidadDto): Promise<Unidad> {
  const { data } = await api.post("/unidades", dto);
  return data;
}

// Actualizar unidad
export async function updateUnidad(
  id: number,
  dto: UpdateUnidadDto
): Promise<Unidad> {
  const { data } = await api.patch(`/unidades/${id}`, dto);
  return data;
}

// Cambiar estado
export async function toggleUnidadActive(id: number): Promise<Unidad> {
  const { data } = await api.patch(`/unidades/${id}/toggle-active`);
  return data;
}

// Eliminar unidad
export async function deleteUnidad(id: number): Promise<void> {
  await api.delete(`/unidades/${id}`);
}
