import { OrdenIngreso } from "./orden-ingreso";
import { Variedad } from "./variedad";
import { Categoria } from "./categoria";
import { Unidad } from "./unidad";
import { Usuario } from "./usuario";

export interface LoteProduccion {
  id_lote_produccion: number;
  id_orden_ingreso: number;
  orden_ingreso: OrdenIngreso;
  id_variedad: number;
  variedad: Variedad;
  id_categoria_salida: number;
  categoria_salida: Categoria;
  nro_lote: string;
  nro_bolsas: number;
  kg_por_bolsa: number;
  total_kg: number;
  presentacion?: string;
  tipo_servicio?: string;
  estado: string;
  fecha_produccion?: Date;
  id_unidad: number;
  unidad: Unidad;
  id_usuario_creador: number;
  usuario_creador: Usuario;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export type CreateLoteProduccionDto = Omit<
  LoteProduccion,
  | "id_lote_produccion"
  | "orden_ingreso"
  | "variedad"
  | "categoria_salida"
  | "unidad"
  | "usuario_creador"
  | "nro_lote"
  | "total_kg"
  | "fecha_creacion"
  | "fecha_actualizacion"
>;

export type UpdateLoteProduccionDto = Partial<CreateLoteProduccionDto>;

export interface InventarioVariedad {
  variedad: string;
  semilla: string;
  categoria: string;
  total_bolsas: string;
  total_kg: string;
}

export interface EstadisticasLote {
  estado: string;
  cantidad: string;
  peso_total: string;
  total_bolsas: string;
}
