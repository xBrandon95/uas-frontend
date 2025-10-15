import api from "@/lib/axios";
import { Variedad, CreateVariedadDto, UpdateVariedadDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener variedades paginadas
export async function getVariedades(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Variedad>> {
  const { data } = await api.get("/variedades", { params });
  return data;
}

// Obtener todas las variedades activas (sin paginación)
export async function getVariedadesActivas(): Promise<Variedad[]> {
  const { data } = await api.get("/variedades/activas");
  return data;
}

// Obtener variedades por semilla
export async function getVariedadesBySemilla(
  idSemilla: number
): Promise<Variedad[]> {
  const { data } = await api.get(`/variedades/semilla/${idSemilla}`);
  return data;
}

// Obtener variedad por id
export async function getVariedadById(id: number): Promise<Variedad> {
  const { data } = await api.get(`/variedades/${id}`);
  return data;
}

// Crear variedad
export async function createVariedad(
  dto: CreateVariedadDto
): Promise<Variedad> {
  const { data } = await api.post("/variedades", dto);
  return data;
}

// Actualizar variedad
export async function updateVariedad(
  id: number,
  dto: UpdateVariedadDto
): Promise<Variedad> {
  const { data } = await api.patch(`/variedades/${id}`, dto);
  return data;
}

// Eliminar variedad
export async function deleteVariedad(id: number): Promise<void> {
  await api.delete(`/variedades/${id}`);
}
