import api from "@/lib/axios";
import { Servicio, CreateServicioDto, UpdateServicioDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener servicios paginados
export async function getServicios(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Servicio>> {
  const { data } = await api.get("/servicios", { params });
  return data;
}

// Obtener todos los servicios activos (sin paginación)
export async function getServiciosActivos(): Promise<Servicio[]> {
  const { data } = await api.get("/servicios/activos");
  return data;
}

// Obtener servicio por id
export async function getServicioById(id: number): Promise<Servicio> {
  const { data } = await api.get(`/servicios/${id}`);
  return data;
}

// Obtener servicio por nombre
export async function getServicioByNombre(nombre: string): Promise<Servicio> {
  const { data } = await api.get(`/servicios/nombre/${nombre}`);
  return data;
}

// Crear servicio
export async function createServicio(
  dto: CreateServicioDto
): Promise<Servicio> {
  const { data } = await api.post("/servicios", dto);
  return data;
}

// Actualizar servicio
export async function updateServicio(
  id: number,
  dto: UpdateServicioDto
): Promise<Servicio> {
  const { data } = await api.patch(`/servicios/${id}`, dto);
  return data;
}

// Cambiar estado (activar/desactivar)
export async function toggleServicioActive(id: number): Promise<Servicio> {
  const { data } = await api.patch(`/servicios/${id}/toggle-activo`);
  return data;
}

// Eliminar servicio
export async function deleteServicio(id: number): Promise<void> {
  await api.delete(`/servicios/${id}`);
}
