export type CreateUnidadDto = Omit<
  Unidad,
  "id_unidad" | "fecha_creacion" | "fecha_actualizacion"
>;

export type UpdateUnidadDto = Partial<CreateUnidadDto>;

export interface Unidad {
  id_unidad: number;
  nombre: string;
  ubicacion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}
