export interface Cliente {
  id_cliente: number;
  nombre: string;
  ci_nit?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  activo: boolean;
}

export type CreateClienteDto = Omit<Cliente, "id_cliente">;
export type UpdateClienteDto = Partial<CreateClienteDto>;
