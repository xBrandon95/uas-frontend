export interface User {
  id_usuario: number;
  nombre: string;
  usuario: string;
  rol: "admin" | "encargado" | "operador";
  id_unidad: number | null;
  nombre_unidad?: string | null;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: User;
}
