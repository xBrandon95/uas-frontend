export interface Vehiculo {
  id_vehiculo: number;
  marca_modelo: string;
  placa: string;
}

export type CreateVehiculoDto = Omit<Vehiculo, "id_vehiculo">;

export type UpdateVehiculoDto = Partial<CreateVehiculoDto>;
