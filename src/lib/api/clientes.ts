import api from "@/lib/axios";
import { Cliente, CreateClienteDto, UpdateClienteDto } from "@/types";
import { PaginationFilterParams, PaginatedResponse } from "@/types";

// Obtener clientes paginados
export async function getClientes(
  params: PaginationFilterParams
): Promise<PaginatedResponse<Cliente>> {
  const { data } = await api.get("/clientes", { params });
  return data;
}

// Obtener todos los clientes activos (sin paginación)
export async function getClientesActivos(): Promise<Cliente[]> {
  const { data } = await api.get("/clientes/activos");
  return data;
}

// Obtener cliente por id
export async function getClienteById(id: number): Promise<Cliente> {
  const { data } = await api.get(`/clientes/${id}`);
  return data;
}

// Crear cliente
export async function createCliente(dto: CreateClienteDto): Promise<Cliente> {
  const { data } = await api.post("/clientes", dto);
  return data;
}

// Actualizar cliente
export async function updateCliente(
  id: number,
  dto: UpdateClienteDto
): Promise<Cliente> {
  const { data } = await api.patch(`/clientes/${id}`, dto);
  return data;
}

// Eliminar cliente
export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`/clientes/${id}`);
}
