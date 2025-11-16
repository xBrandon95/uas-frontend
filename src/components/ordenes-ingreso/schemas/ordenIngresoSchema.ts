// src/components/ordenes-ingreso/schemas/ordenIngresoSchema.ts
import * as z from "zod";

// Transformador común: convierte string/empty a número o lanza error
const toNumber = (val: unknown): number => {
  // Si es undefined, null o string vacío, lanzar error
  if (val === undefined || val === null || val === "") {
    throw new Error("Campo requerido");
  }

  // Si ya es número, retornarlo
  if (typeof val === "number") {
    if (isNaN(val)) throw new Error("Debe ser un número válido");
    return val;
  }

  // Si es string, intentar parsear
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) throw new Error("Debe ser un número válido");
    return parsed;
  }

  throw new Error("Debe ser un número válido");
};

// Helper para números REQUERIDOS
const requiredNumber = (fieldName: string) =>
  z.preprocess(
    (val) => {
      try {
        return toNumber(val);
      } catch {
        return undefined;
      }
    },
    z.number({
      message: `${fieldName} es requerido`,
    })
  );

// Helper para porcentajes REQUERIDOS (0-100) con límite automático
const requiredPercentage = (fieldName: string) =>
  z.preprocess(
    (val) => {
      try {
        let num = toNumber(val);

        // Limitar automáticamente entre 0 y 100
        if (num > 100) num = 100;
        if (num < 0) num = 0;

        return num;
      } catch {
        return undefined;
      }
    },
    z
      .number({
        message: `${fieldName} es requerido`,
      })
      .min(0, `${fieldName} no puede ser menor a 0%`)
      .max(100, `${fieldName} no puede ser mayor a 100%`)
  );

// Schema base para campos comunes (TODOS REQUERIDOS)
const baseFields = {
  peso_bruto: requiredNumber("Peso bruto"),
  peso_tara: requiredNumber("Peso tara"),
  peso_neto: requiredNumber("Peso neto"),
  peso_liquido: requiredNumber("Peso líquido"),
  porcentaje_humedad: requiredPercentage("Humedad"),
  porcentaje_impureza: requiredPercentage("Impureza"),
  peso_hectolitrico: requiredPercentage("Peso hectolítrico"),
  porcentaje_grano_danado: requiredPercentage("Grano dañado"),
  porcentaje_grano_verde: requiredPercentage("Grano verde"),
  // Únicos campos opcionales
  observaciones: z.string().optional(),
};

// Schema para CREAR orden (TODOS LOS CAMPOS REQUERIDOS)
export const createOrdenSchema = z.object({
  // Información general
  id_semillera: z.number({ message: "Semillera es requerida" }),
  id_cooperador: z.number({ message: "Cooperador es requerido" }),
  id_conductor: z.number({ message: "Conductor es requerido" }),
  id_vehiculo: z.number({ message: "Vehículo es requerido" }),
  // Información de semilla
  id_semilla: z.number({ message: "Semilla es requerida" }),
  id_variedad: z.number({ message: "Variedad es requerida" }),
  id_categoria_ingreso: z.number({
    message: "Categoría es requerida",
  }),
  nro_lote_campo: z.string().min(1, "Nº Lote Campo es requerido"),
  nro_cupon: z.string().min(1, "Nº Cupón es requerido"),
  // Campos opcionales
  lugar_ingreso: z.string().optional(),
  lugar_salida: z.string().optional(),
  estado: z.string().default("pendiente"),
  // Campos de pesaje y laboratorio (TODOS REQUERIDOS)
  ...baseFields,
});

// Schema para EDITAR orden (solo campos editables, TODOS REQUERIDOS)
export const updateOrdenSchema = z.object({
  ...baseFields,
});

// Tipos derivados de los schemas
export type CreateOrdenFormData = z.infer<typeof createOrdenSchema>;
export type UpdateOrdenFormData = z.infer<typeof updateOrdenSchema>;
