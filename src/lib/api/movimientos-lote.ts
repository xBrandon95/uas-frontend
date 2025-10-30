import api from "@/lib/axios";
import { MovimientoLote, ResumenMovimientos } from "@/types";

export async function getMovimientosByLote(
  idLote: number
): Promise<MovimientoLote[]> {
  const { data } = await api.get(`/movimientos-lote/lote/${idLote}`);
  return data;
}

export async function getResumenMovimientos(
  idLote: number
): Promise<ResumenMovimientos> {
  const { data } = await api.get(`/movimientos-lote/lote/${idLote}/resumen`);
  return data;
}

export async function getMovimientosByOrdenSalida(
  idOrden: number
): Promise<MovimientoLote[]> {
  const { data } = await api.get(`/movimientos-lote/orden-salida/${idOrden}`);
  return data;
}
