export type CreateSemillaDto = Omit<Semilla, "id_semilla">;

export type UpdateSemillaDto = Partial<CreateSemillaDto>;

export interface Semilla {
  id_semilla: number;
  nombre: string;
  activo: boolean;
}
