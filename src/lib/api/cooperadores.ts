import api from "@/lib/axios";
import { Cooperador } from "@/types";
import {
  PaginationFilterParams,
  PaginatedResponse,
  CreateCooperadorDto,
  UpdateCooperadorDto,
} from "@/types";

// Obtener cooperadores paginados
export async function getCooperadores(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Cooperador>> {
  const { data } = await api.get("/cooperadores", { params });
  console.log(data);
  return data;
}

// Obtener cooperador por id
export async function getCooperadorById(id: number): Promise<Cooperador> {
  const { data } = await api.get(`/cooperadores/${id}`);
  return data;
}

// Obtener cooperadores activos
export async function getCooperadoresActivos(): Promise<Cooperador[]> {
  const { data } = await api.get("/cooperadores/activos");
  return data;
}

// Crear cooperador
export async function createCooperador(
  dto: CreateCooperadorDto
): Promise<Cooperador> {
  const { data } = await api.post("/cooperadores", dto);
  return data;
}

// Actualizar cooperador
export async function updateCooperador(
  id: number,
  dto: UpdateCooperadorDto
): Promise<Cooperador> {
  const { data } = await api.patch(`/cooperadores/${id}`, dto);
  return data;
}

// Eliminar cooperador
export async function deleteCooperador(id: number): Promise<void> {
  await api.delete(`/cooperadores/${id}`);
}
