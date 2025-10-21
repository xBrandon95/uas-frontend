// Actualizar completamente src/lib/api/ordenes-salida.ts

import api from "@/lib/axios";
import {
  OrdenSalida,
  CreateOrdenSalidaDto,
  UpdateOrdenSalidaDto,
} from "@/types";
import { LoteProduccion } from "@/types";

// Obtener todas las órdenes
export async function getOrdenesSalida(): Promise<OrdenSalida[]> {
  const { data } = await api.get("/ordenes-salida");
  return data;
}

// Obtener lotes disponibles para la orden
export async function getLotesDisponiblesParaOrden(): Promise<
  LoteProduccion[]
> {
  const { data } = await api.get("/ordenes-salida/lotes-disponibles");
  return data;
}

// Obtener órdenes por estado
export async function getOrdenesSalidaByEstado(
  estado: string
): Promise<OrdenSalida[]> {
  const { data } = await api.get(`/ordenes-salida/estado/${estado}`);
  return data;
}

// Obtener órdenes por unidad
export async function getOrdenesSalidaByUnidad(
  idUnidad: number
): Promise<OrdenSalida[]> {
  const { data } = await api.get(`/ordenes-salida/unidad/${idUnidad}`);
  return data;
}

// Obtener órdenes por cliente
export async function getOrdenesSalidaByCliente(
  idCliente: number
): Promise<OrdenSalida[]> {
  const { data } = await api.get(`/ordenes-salida/cliente/${idCliente}`);
  return data;
}

// Obtener estadísticas
export async function getEstadisticasOrdenesSalida(
  idUnidad?: number
): Promise<any> {
  const { data } = await api.get("/ordenes-salida/estadisticas", {
    params: idUnidad ? { idUnidad } : {},
  });
  return data;
}

// Obtener orden por número
export async function getOrdenSalidaByNumero(
  numeroOrden: string
): Promise<OrdenSalida> {
  const { data } = await api.get(`/ordenes-salida/numero/${numeroOrden}`);
  return data;
}

// Obtener orden por id
export async function getOrdenSalidaById(id: number): Promise<OrdenSalida> {
  const { data } = await api.get(`/ordenes-salida/${id}`);
  return data;
}

// Crear orden
export async function createOrdenSalida(
  dto: CreateOrdenSalidaDto
): Promise<OrdenSalida> {
  const { data } = await api.post("/ordenes-salida", dto);
  return data;
}

// Actualizar orden
export async function updateOrdenSalida(
  id: number,
  dto: UpdateOrdenSalidaDto
): Promise<OrdenSalida> {
  const { data } = await api.patch(`/ordenes-salida/${id}`, dto);
  return data;
}

// Cambiar estado
export async function cambiarEstadoOrdenSalida(
  id: number,
  estado: string
): Promise<OrdenSalida> {
  const { data } = await api.patch(`/ordenes-salida/${id}/estado`, { estado });
  return data;
}

// Eliminar orden
export async function deleteOrdenSalida(id: number): Promise<void> {
  await api.delete(`/ordenes-salida/${id}`);
}
