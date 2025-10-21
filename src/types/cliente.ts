export interface Cliente {
  id_cliente: number;
  nombre: string;
  nit?: string;
  telefono?: string;
  direccion?: string;
}

export type CreateClienteDto = Omit<Cliente, "id_cliente">;
export type UpdateClienteDto = Partial<CreateClienteDto>;
