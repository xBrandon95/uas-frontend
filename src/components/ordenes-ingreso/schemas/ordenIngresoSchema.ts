// src/components/ordenes-ingreso/schemas/ordenIngresoSchema.ts
import * as z from "zod";

// Schema base para campos comunes
const baseFields = {
  peso_bruto: z.number({ message: "Requerido" }),
  peso_tara: z.number({ message: "Requerido" }),
  peso_neto: z.number({ message: "Requerido" }),
  peso_liquido: z.number({ message: "Requerido" }),
  porcentaje_humedad: z
    .number({
      required_error: "Campo requerido",
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "No puede ser menor a 0%")
    .max(100, "No puede ser mayor a 100%"),
  porcentaje_impureza: z
    .number({
      required_error: "Campo requerido",
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "No puede ser menor a 0%")
    .max(100, "No puede ser mayor a 100%"),
  peso_hectolitrico: z
    .number({
      required_error: "Campo requerido",
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "No puede ser menor a 0")
    .positive("Debe ser un valor positivo"),
  porcentaje_grano_danado: z
    .number({
      required_error: "Campo requerido",
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "No puede ser menor a 0%")
    .max(100, "No puede ser mayor a 100%"),
  porcentaje_grano_verde: z
    .number({
      required_error: "Campo requerido",
      invalid_type_error: "Debe ser un número",
    })
    .min(0, "No puede ser menor a 0%")
    .max(100, "No puede ser mayor a 100%"),
  observaciones: z.string().optional(),
};

// Schema para CREAR orden
export const createOrdenSchema = z.object({
  id_semillera: z.number({ message: "Requerido" }),
  id_cooperador: z.number({ message: "Requerido" }),
  id_conductor: z.number({ message: "Requerido" }),
  id_vehiculo: z.number({ message: "Requerido" }),
  id_semilla: z.number({ message: "Requerido" }),
  id_variedad: z.number({ message: "Requerido" }),
  id_categoria_ingreso: z.number({ message: "Requerido" }),
  nro_lote_campo: z.string({ message: "Requerido" }).min(1, "Campo requerido"),
  nro_cupon: z.string({ message: "Requerido" }).min(1, "Campo requerido"),
  lugar_ingreso: z.string().optional(),
  lugar_salida: z.string().optional(),
  estado: z.string().default("pendiente"),
  ...baseFields,
});

// Schema para EDITAR orden (solo campos editables)
export const updateOrdenSchema = z.object({
  ...baseFields,
});

// Tipos derivados de los schemas
export type CreateOrdenFormData = z.infer<typeof createOrdenSchema>;
export type UpdateOrdenFormData = z.infer<typeof updateOrdenSchema>;
