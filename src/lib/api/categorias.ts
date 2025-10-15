import api from "@/lib/axios";
import { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener categorías paginadas
export async function getCategorias(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Categoria>> {
  const { data } = await api.get("/categorias", { params });
  return data;
}

// Obtener todas las categorías activas (sin paginación)
export async function getCategoriasActivas(): Promise<Categoria[]> {
  const { data } = await api.get("/categorias/activas");
  return data;
}

// Obtener categoría por id
export async function getCategoriaById(id: number): Promise<Categoria> {
  const { data } = await api.get(`/categorias/${id}`);
  return data;
}

// Crear categoría
export async function createCategoria(
  dto: CreateCategoriaDto
): Promise<Categoria> {
  const { data } = await api.post("/categorias", dto);
  return data;
}

// Actualizar categoría
export async function updateCategoria(
  id: number,
  dto: UpdateCategoriaDto
): Promise<Categoria> {
  const { data } = await api.patch(`/categorias/${id}`, dto);
  return data;
}

// Eliminar categoría
export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}
