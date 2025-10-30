import { useQuery } from "@tanstack/react-query";
import {
  getMovimientosByLote,
  getResumenMovimientos,
  getMovimientosByOrdenSalida,
} from "@/lib/api/movimientos-lote";

export function useMovimientosByLote(idLote: number | null) {
  return useQuery({
    queryKey: ["movimientos-lote", "lote", idLote],
    queryFn: () => getMovimientosByLote(idLote!),
    enabled: !!idLote,
    staleTime: 30000,
  });
}

export function useResumenMovimientos(idLote: number | null) {
  return useQuery({
    queryKey: ["movimientos-lote", "resumen", idLote],
    queryFn: () => getResumenMovimientos(idLote!),
    enabled: !!idLote,
    staleTime: 30000,
  });
}

export function useMovimientosByOrdenSalida(idOrden: number | null) {
  return useQuery({
    queryKey: ["movimientos-lote", "orden-salida", idOrden],
    queryFn: () => getMovimientosByOrdenSalida(idOrden!),
    enabled: !!idOrden,
    staleTime: 30000,
  });
}
