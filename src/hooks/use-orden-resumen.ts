import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface ResumenProduccion {
  orden_ingreso: {
    numero_orden: string;
    peso_neto: number;
    estado: string;
  };
  produccion: {
    total_kg_producido: string;
    total_bolsas_producidas: number;
    cantidad_lotes: number;
    peso_disponible: string;
    porcentaje_utilizado: string;
  };
  lotes: Array<{
    nro_lote: string;
    variedad: string;
    categoria: string;
    nro_bolsas: number;
    kg_por_bolsa: string;
    total_kg: string;
    estado: string;
    presentacion: string;
  }>;
}

async function getResumenProduccion(id: number): Promise<ResumenProduccion> {
  const { data } = await api.get(`/ordenes-ingreso/${id}/resumen-produccion`);
  return data;
}

export function useResumenProduccion(ordenId: number | null) {
  return useQuery({
    queryKey: ["orden-resumen", ordenId],
    queryFn: () => getResumenProduccion(ordenId!),
    enabled: !!ordenId,
    staleTime: 30000, // 30 segundos
    refetchOnMount: "always",
  });
}
