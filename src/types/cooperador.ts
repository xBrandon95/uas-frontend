export type CreateCooperadorDto = Omit<Cooperador, "id_cooperador">;

export type UpdateCooperadorDto = Partial<CreateCooperadorDto>;

export interface Cooperador {
  id_cooperador: number;
  nombre: string;
  ci: string;
  telefono?: string;
}
