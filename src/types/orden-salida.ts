// Actualizar src/types/orden-salida.ts con esta versión completa

import { Semillera } from "./semillera";
import { Cliente } from "./cliente";
import { Conductor } from "./conductor";
import { Vehiculo } from "./vehiculo";
import { Unidad } from "./unidad";
import { Usuario } from "./usuario";
import { Variedad } from "./variedad";
import { Categoria } from "./categoria";
import { LoteProduccion } from "./lote-produccion";

export interface DetalleOrdenSalida {
  id_detalle_salida: number;
  id_orden_salida: number;
  id_lote_produccion: number;
  lote_produccion: LoteProduccion;
  id_variedad: number;
  variedad: Variedad;
  id_categoria: number;
  categoria: Categoria;
  nro_lote: string;
  tamano: string;
  nro_bolsas: number;
  kg_bolsa: number;
  total_kg: number;
}

export interface OrdenSalida {
  id_orden_salida: number;
  numero_orden: string;
  id_semillera: number;
  semillera: Semillera;
  id_cliente: number;
  cliente: Cliente;
  id_conductor: number;
  conductor: Conductor;
  id_vehiculo: number;
  vehiculo: Vehiculo;
  id_unidad: number;
  unidad: Unidad;
  fecha_salida: Date;
  deposito?: string;
  observaciones?: string;
  estado: string;
  id_usuario_creador: number;
  usuario_creador: Usuario;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  detalles: DetalleOrdenSalida[];
}

export interface CreateDetalleOrdenSalidaDto {
  id_lote_produccion: number;
  id_variedad: number;
  id_categoria: number;
  nro_lote: string;
  tamano?: string;
  nro_bolsas: number;
  kg_bolsa: number;
}

export type CreateOrdenSalidaDto = {
  id_semillera: number;
  id_cliente: number;
  id_conductor: number;
  id_vehiculo: number;
  id_unidad: number;
  fecha_salida: string;
  deposito?: string;
  observaciones?: string;
  estado?: string;
  detalles: CreateDetalleOrdenSalidaDto[];
};

export type UpdateOrdenSalidaDto = Partial<
  Omit<CreateOrdenSalidaDto, "detalles">
>;
