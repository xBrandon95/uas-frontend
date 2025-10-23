import api from "@/lib/axios";
import {
  OrdenIngreso,
  CreateOrdenIngresoDto,
  UpdateOrdenIngresoDto,
  PaginationFilterParams,
  PaginatedResponse,
} from "@/types";

// Obtener órdenes con paginación
export async function getOrdenesIngreso(
  params: PaginationFilterParams
): Promise<PaginatedResponse<OrdenIngreso>> {
  const { data } = await api.get("/ordenes-ingreso", { params });
  return data;
}

// Obtener todas las órdenes sin paginación (para casos específicos)
export async function getOrdenesIngresoAll(): Promise<OrdenIngreso[]> {
  const { data } = await api.get("/ordenes-ingreso/all");
  return data;
}

// Obtener órdenes por estado
export async function getOrdenesIngresoByEstado(
  estado: string
): Promise<OrdenIngreso[]> {
  const { data } = await api.get(`/ordenes-ingreso/estado/${estado}`);
  return data;
}

// Obtener órdenes por unidad
export async function getOrdenesIngresoByUnidad(
  idUnidad: number
): Promise<OrdenIngreso[]> {
  const { data } = await api.get(`/ordenes-ingreso/unidad/${idUnidad}`);
  return data;
}

// Obtener órdenes por rango de fechas
export async function getOrdenesIngresoByFecha(
  fechaInicio: string,
  fechaFin: string
): Promise<OrdenIngreso[]> {
  const { data } = await api.get("/ordenes-ingreso/fecha", {
    params: { inicio: fechaInicio, fin: fechaFin },
  });
  return data;
}

// Obtener estadísticas
export async function getEstadisticasOrdenesIngreso(
  idUnidad?: number
): Promise<any> {
  const { data } = await api.get("/ordenes-ingreso/estadisticas", {
    params: idUnidad ? { idUnidad } : {},
  });
  return data;
}

// Obtener orden por número
export async function getOrdenIngresoByNumero(
  numeroOrden: string
): Promise<OrdenIngreso> {
  const { data } = await api.get(`/ordenes-ingreso/numero/${numeroOrden}`);
  return data;
}

// Obtener orden por id
export async function getOrdenIngresoById(id: number): Promise<OrdenIngreso> {
  const { data } = await api.get(`/ordenes-ingreso/${id}`);
  return data;
}

// Crear orden
export async function createOrdenIngreso(
  dto: CreateOrdenIngresoDto
): Promise<OrdenIngreso> {
  const { data } = await api.post("/ordenes-ingreso", dto);
  return data;
}

// Actualizar orden
export async function updateOrdenIngreso(
  id: number,
  dto: UpdateOrdenIngresoDto
): Promise<OrdenIngreso> {
  const { data } = await api.patch(`/ordenes-ingreso/${id}`, dto);
  return data;
}

// Cambiar estado
export async function cambiarEstadoOrdenIngreso(
  id: number,
  estado: string
): Promise<OrdenIngreso> {
  const { data } = await api.patch(`/ordenes-ingreso/${id}/estado`, { estado });
  return data;
}

// Eliminar orden
export async function deleteOrdenIngreso(id: number): Promise<void> {
  await api.delete(`/ordenes-ingreso/${id}`);
}
