export interface Conductor {
  id_conductor: number;
  nombre: string;
  ci: string;
  telefono?: string;
}

export type CreateConductorDto = Omit<Conductor, "id_conductor">;

export type UpdateConductorDto = Partial<CreateConductorDto>;
