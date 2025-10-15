import { Semilla } from "./semilla";

export interface Variedad {
  id_variedad: number;
  id_semilla: number;
  semilla: Semilla;
  nombre: string;
}

export type CreateVariedadDto = Omit<Variedad, "id_variedad" | "semilla">;

export type UpdateVariedadDto = Partial<CreateVariedadDto>;
