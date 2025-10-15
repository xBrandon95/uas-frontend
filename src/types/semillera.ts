export interface Semillera {
  id_semillera: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
}

export type CreateSemilleraDto = Omit<Semillera, "id_semillera">;

export type UpdateSemilleraDto = Partial<CreateSemilleraDto>;
