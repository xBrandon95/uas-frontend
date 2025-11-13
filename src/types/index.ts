// ============================================
// AUTH TYPES
// ============================================

import { LoteProduccion } from "./lote-produccion";

export * from "./auth";
export * from "./unidad";
export * from "./usuario";
export * from "./pagination";
export * from "./semilla";
export * from "./variedad";
export * from "./conductor";
export * from "./vehiculo";
export * from "./categoria";
export * from "./semillera";
export * from "./cooperador";
export * from "./orden-ingreso";
export * from "./lote-produccion";
export * from "./orden-salida";
export * from "./cliente";
export * from "./movimiento-lote";
export * from "./servicio";

// ============================================
// ENTIDADES MAESTRAS
// ============================================

// export interface Cooperador {
//   id_cooperador: number;
//   id_semillera: number;
//   semillera?: Semillera;
//   nombre: string;
//   ci?: string;
//   telefono?: string;
//   direccion?: string;
//   activo: boolean;
// }

// export interface Cliente {
//   id_cliente: number;
//   nombre: string;
//   nit?: string;
//   telefono?: string;
//   direccion?: string;
//   email?: string;
//   activo: boolean;
// }

// ============================================
// PROCESOS OPERATIVOS
// ============================================

export interface OrdenIngreso {
  id_orden_ingreso: number;
  numero_orden: string;
  id_semillera: number;
  semillera?: Semillera;
  id_cooperador: number;
  cooperador?: Cooperador;
  id_conductor: number;
  conductor?: Conductor;
  id_vehiculo: number;
  vehiculo?: Vehiculo;
  id_semilla: number;
  semilla?: Semilla;
  id_variedad: number;
  variedad?: Variedad;
  id_categoria_ingreso: number;
  categoria_ingreso?: Categoria;
  id_unidad: number;
  unidad?: Unidad;
  nro_lote_campo?: string;
  cantidad_unidades?: number;
  nro_cupon?: string;
  lugar_ingreso?: string;
  hora_ingreso?: string;
  lugar_salida?: string;
  hora_salida?: string;
  peso_bruto?: number;
  peso_tara?: number;
  peso_neto?: number;
  peso_liquido?: number;
  porcentaje_humedad?: number;
  porcentaje_impureza?: number;
  peso_hectolitrico?: number;
  porcentaje_grano_danado?: number;
  porcentaje_grano_verde?: number;
  observaciones?: string;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// export interface LoteProduccion {
//   id_lote_produccion: number;
//   id_orden_ingreso: number;
//   orden_ingreso?: OrdenIngreso;
//   id_variedad: number;
//   variedad?: Variedad;
//   id_categoria_salida: number;
//   categoria_salida?: Categoria;
//   nro_lote: string;
//   cantidad_unidades: number;
//   kg_por_unidad: number;
//   total_kg: number;
//   presentacion?: string;
//   tipo_servicio?: string;
//   estado: string;
//   fecha_produccion?: string;
//   id_unidad: number;
//   unidad?: Unidad;
//   fecha_creacion: string;
//   fecha_actualizacion: string;
// }

export interface DetalleOrdenSalida {
  id_detalle_salida?: number;
  id_lote_produccion: number;
  lote_produccion?: LoteProduccion;
  id_variedad: number;
  variedad?: Variedad;
  id_categoria: number;
  categoria?: Categoria;
  nro_lote: string;
  tamano?: string;
  cantidad_unidades: number;
  kg_por_unidad: number;
  total_kg?: number;
}

// export interface OrdenSalida {
//   id_orden_salida: number;
//   numero_orden: string;
//   id_semillera: number;
//   semillera?: Semillera;
//   id_cliente: number;
//   cliente?: Cliente;
//   id_conductor: number;
//   conductor?: Conductor;
//   id_vehiculo: number;
//   vehiculo?: Vehiculo;
//   id_unidad: number;
//   unidad?: Unidad;
//   deposito?: string;
//   observaciones?: string;
//   estado: string;
//   fecha_salida: string;
//   detalles: DetalleOrdenSalida[];
//   fecha_creacion: string;
//   fecha_actualizacion: string;
// }

// ============================================
// INVENTARIO Y REPORTES
// ============================================

export interface InventarioItem {
  variedad: string;
  semilla: string;
  categoria: string;
  total_unidades: number;
  total_kg: number;
}

export interface Estadistica {
  estado: string;
  cantidad: number;
  peso_total: number;
}

// ============================================
// FORMS
// ============================================

export interface CreateOrdenIngresoForm {
  id_semillera: number;
  id_cooperador: number;
  id_conductor: number;
  id_vehiculo: number;
  id_semilla: number;
  id_variedad: number;
  id_categoria_ingreso: number;
  id_unidad: number;
  nro_lote_campo?: string;
  cantidad_unidades?: number;
  nro_cupon?: string;
  peso_bruto?: number;
  peso_tara?: number;
  peso_neto?: number;
  peso_liquido?: number;
  porcentaje_humedad?: number;
  porcentaje_impureza?: number;
  peso_hectolitrico?: number;
  porcentaje_grano_danado?: number;
  porcentaje_grano_verde?: number;
  observaciones?: string;
}

export interface CreateLoteProduccionForm {
  id_orden_ingreso: number;
  id_variedad: number;
  id_categoria_salida: number;
  cantidad_unidades: number;
  kg_por_bolsa: number;
  presentacion?: string;
  tipo_servicio?: string;
  fecha_produccion?: string;
  id_unidad: number;
}

export interface CreateOrdenSalidaForm {
  id_semillera: number;
  id_cliente: number;
  id_conductor: number;
  id_vehiculo: number;
  id_unidad: number;
  deposito?: string;
  observaciones?: string;
  fecha_salida: string;
  detalles: DetalleOrdenSalida[];
}
