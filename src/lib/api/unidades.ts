import api from "../axios";
import { Unidad } from "@/types";

export interface CreateUnidadDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateUnidadDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export const unidadesApi = {
  // Obtener todas las unidades
  getAll: async (): Promise<Unidad[]> => {
    const response = await api.get("/unidades");
    return response.data;
  },

  // Obtener solo unidades activas
  getActivas: async (): Promise<Unidad[]> => {
    const response = await api.get("/unidades/activas");
    return response.data;
  },

  // Obtener una unidad por ID
  getById: async (id: number): Promise<Unidad> => {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  },

  // Crear una nueva unidad
  create: async (data: CreateUnidadDto): Promise<Unidad> => {
    const response = await api.post("/unidades", data);
    return response.data;
  },

  // Actualizar una unidad
  update: async (id: number, data: UpdateUnidadDto): Promise<Unidad> => {
    const response = await api.patch(`/unidades/${id}`, data);
    return response.data;
  },

  // Cambiar estado activo/inactivo
  toggleActive: async (id: number): Promise<Unidad> => {
    const response = await api.patch(`/unidades/${id}/toggle-active`);
    return response.data;
  },

  // Eliminar una unidad
  delete: async (id: number): Promise<void> => {
    await api.delete(`/unidades/${id}`);
  },
};
