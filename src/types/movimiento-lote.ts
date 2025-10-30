import { LoteProduccion } from "./lote-produccion";
import { OrdenSalida } from "./orden-salida";
import { Usuario } from "./usuario";

export interface MovimientoLote {
  id_movimiento: number;
  id_lote_produccion: number;
  tipo_movimiento: "entrada" | "salida" | "ajuste" | "merma";
  cantidad_unidades: number;
  kg_movidos: string | number;
  saldo_unidades: number;
  saldo_kg: string | number;
  id_orden_salida?: number;
  observaciones?: string;
  id_usuario: number;
  fecha_movimiento: Date | string;

  // Relaciones
  lote_produccion?: LoteProduccion;
  orden_salida?: OrdenSalida;
  usuario?: Usuario;
}

export interface ResumenMovimientos {
  total_entradas: number;
  total_salidas: number;
  saldo_actual: number;
  cantidad_movimientos: number;
}
