import { Semillera } from "./semillera";
import { Cooperador } from "./cooperador";
import { Conductor } from "./conductor";
import { Vehiculo } from "./vehiculo";
import { Semilla } from "./semilla";
import { Variedad } from "./variedad";
import { Categoria } from "./categoria";
import { Unidad } from "./unidad";
import { Usuario } from "./usuario";

export interface OrdenIngreso {
  id_orden_ingreso: number;
  numero_orden: string;

  // Relaciones de transporte
  id_semillera: number;
  semillera?: Semillera;
  id_cooperador: number;
  cooperador?: Cooperador;
  id_conductor: number;
  conductor?: Conductor;
  id_vehiculo: number;
  vehiculo?: Vehiculo;

  // Información de la semilla
  id_semilla: number;
  semilla?: Semilla;
  id_variedad: number;
  variedad?: Variedad;
  id_categoria_ingreso: number;
  categoria_ingreso?: Categoria;
  nro_lote_campo: string;
  nro_cupon: string;

  // Datos de ingreso/salida
  lugar_ingreso?: string;
  hora_ingreso?: Date;
  lugar_salida?: string;
  hora_salida?: Date;

  // Datos de pesaje
  peso_bruto: number;
  peso_tara: number;
  peso_neto: number;
  peso_liquido: number;

  // Datos de laboratorio
  porcentaje_humedad: number;
  porcentaje_impureza: number;
  peso_hectolitrico: number;
  porcentaje_grano_danado: number;
  porcentaje_grano_verde: number;

  // Observaciones
  observaciones?: string;

  // Estado y tracking
  estado: string;
  id_unidad: number;
  unidad?: Unidad;
  id_usuario_creador: number;
  usuario_creador?: Usuario;
  fecha_creacion: Date;
  fecha_actualizacion: Date;

  // Propiedades adicionales del backend
  tiene_lotes_produccion?: boolean;
  cantidad_lotes?: number;
}

export type CreateOrdenIngresoDto = Omit<
  OrdenIngreso,
  | "id_orden_ingreso"
  | "numero_orden"
  | "id_usuario_creador"
  | "id_unidad"
  | "semillera"
  | "cooperador"
  | "conductor"
  | "vehiculo"
  | "semilla"
  | "variedad"
  | "categoria_ingreso"
  | "unidad"
  | "usuario_creador"
  | "fecha_creacion"
  | "fecha_actualizacion"
> & {
  id_unidad?: number;
};

export type UpdateOrdenIngresoDto = {
  peso_bruto: number;
  peso_tara: number;
  peso_neto: number;
  peso_liquido: number;
  porcentaje_humedad: number;
  porcentaje_impureza: number;
  peso_hectolitrico: number;
  porcentaje_grano_danado: number;
  porcentaje_grano_verde: number;
  observaciones?: string;
};

export interface CreateOrdenIngresoForm {
  id_semillera: number;
  id_cooperador: number;
  id_conductor: number;
  id_vehiculo: number;
  id_semilla: number;
  id_variedad: number;
  id_categoria_ingreso: number;
  id_unidad: number;

  nro_lote_campo: string;
  nro_cupon: string;

  // Datos de pesaje
  peso_bruto: number;
  peso_tara: number;
  peso_neto: number;
  peso_liquido: number;

  // Datos de laboratorio
  porcentaje_humedad: number;
  porcentaje_impureza: number;
  peso_hectolitrico: number;
  porcentaje_grano_danado: number;
  porcentaje_grano_verde: number;

  // Observaciones
  observaciones?: string;
}
