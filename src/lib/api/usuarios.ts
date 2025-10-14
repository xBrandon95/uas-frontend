import api from "@/lib/axios";
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener usuarios paginados
export async function getUsuarios(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Usuario>> {
  const { data } = await api.get("/usuarios", { params });
  console.log(data);
  return data;
}

// Obtener usuario por id
export async function getUsuarioById(id: number): Promise<Usuario> {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
}

// Crear usuario
export async function createUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
  const { data } = await api.post("/usuarios", dto);
  return data;
}

// Actualizar usuario
export async function updateUsuario(
  id: number,
  dto: UpdateUsuarioDto
): Promise<Usuario> {
  const { data } = await api.patch(`/usuarios/${id}`, dto);
  return data;
}

// Cambiar estado activo
export async function toggleUsuarioActive(id: number): Promise<Usuario> {
  const { data } = await api.patch(`/usuarios/${id}/toggle-active`);
  return data;
}

// Eliminar usuario
export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

// Obtener usuarios por unidad
export async function getUsuariosByUnidad(
  unidadId: number
): Promise<Usuario[]> {
  const { data } = await api.get(`/usuarios/unidad/${unidadId}`);
  return data;
}
