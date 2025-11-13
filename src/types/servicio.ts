export interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export type CreateServicioDto = Omit<
  Servicio,
  "id_servicio" | "fecha_creacion" | "fecha_actualizacion"
>;

export type UpdateServicioDto = Partial<CreateServicioDto>;
