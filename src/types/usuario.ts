import { Unidad } from "./unidad";

export enum Role {
  ADMIN = "admin",
  ENCARGADO = "encargado",
  OPERADOR = "operador",
}

export interface Usuario {
  id_usuario: number;
  id_unidad?: number | null;
  unidad?: Unidad | null;
  nombre: string;
  usuario: string;
  rol: Role;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export type CreateUsuarioDto = {
  id_unidad?: number;
  nombre: string;
  usuario: string;
  password: string;
  rol?: Role;
  activo?: boolean;
};

export type UpdateUsuarioDto = Partial<Omit<CreateUsuarioDto, "password">> & {
  password?: string;
};
