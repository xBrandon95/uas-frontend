export interface Categoria {
  id_categoria: number;
  nombre: string;
}

export type CreateCategoriaDto = Omit<Categoria, "id_categoria">;

export type UpdateCategoriaDto = Partial<CreateCategoriaDto>;
