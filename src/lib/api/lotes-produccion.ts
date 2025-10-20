import api from "@/lib/axios";
import {
  LoteProduccion,
  CreateLoteProduccionDto,
  UpdateLoteProduccionDto,
  InventarioVariedad,
  EstadisticasLote,
} from "@/types";

// Obtener todos los lotes
export async function getLotesProduccion(): Promise<LoteProduccion[]> {
  const { data } = await api.get("/lotes-produccion");
  return data;
}

// Obtener lotes disponibles
export async function getLotesDisponibles(): Promise<LoteProduccion[]> {
  const { data } = await api.get("/lotes-produccion/disponibles");
  return data;
}

// Obtener lotes por estado
export async function getLotesByEstado(
  estado: string
): Promise<LoteProduccion[]> {
  const { data } = await api.get(`/lotes-produccion/estado/${estado}`);
  return data;
}

// Obtener lotes por unidad
export async function getLotesByUnidad(
  idUnidad: number
): Promise<LoteProduccion[]> {
  const { data } = await api.get(`/lotes-produccion/unidad/${idUnidad}`);
  return data;
}

// Obtener lotes por variedad
export async function getLotesByVariedad(
  idVariedad: number
): Promise<LoteProduccion[]> {
  const { data } = await api.get(`/lotes-produccion/variedad/${idVariedad}`);
  return data;
}

// Obtener lotes por orden de ingreso
export async function getLotesByOrdenIngreso(
  idOrdenIngreso: number
): Promise<LoteProduccion[]> {
  const { data } = await api.get(
    `/lotes-produccion/orden-ingreso/${idOrdenIngreso}`
  );
  return data;
}

// Obtener inventario por variedad
export async function getInventarioVariedad(): Promise<InventarioVariedad[]> {
  const { data } = await api.get("/lotes-produccion/inventario");
  return data;
}

// Obtener estadísticas
export async function getEstadisticasLotes(
  idUnidad?: number
): Promise<EstadisticasLote[]> {
  const { data } = await api.get("/lotes-produccion/estadisticas", {
    params: idUnidad ? { idUnidad } : {},
  });
  return data;
}

// Obtener lote por número
export async function getLoteByNumero(
  numeroLote: string
): Promise<LoteProduccion> {
  const { data } = await api.get(`/lotes-produccion/numero/${numeroLote}`);
  return data;
}

// Obtener lote por id
export async function getLoteProduccionById(
  id: number
): Promise<LoteProduccion> {
  const { data } = await api.get(`/lotes-produccion/${id}`);
  return data;
}

// Crear lote
export async function createLoteProduccion(
  dto: CreateLoteProduccionDto
): Promise<LoteProduccion> {
  console.log(dto);
  const { data } = await api.post("/lotes-produccion", dto);
  return data;
}

// Actualizar lote
export async function updateLoteProduccion(
  id: number,
  dto: UpdateLoteProduccionDto
): Promise<LoteProduccion> {
  const { data } = await api.patch(`/lotes-produccion/${id}`, dto);
  return data;
}

// Cambiar estado
export async function cambiarEstadoLote(
  id: number,
  estado: string
): Promise<LoteProduccion> {
  const { data } = await api.patch(`/lotes-produccion/${id}/estado`, {
    estado,
  });
  return data;
}

// Eliminar lote
export async function deleteLoteProduccion(id: number): Promise<void> {
  await api.delete(`/lotes-produccion/${id}`);
}
