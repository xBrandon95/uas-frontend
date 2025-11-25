// src/components/ordenes-ingreso/hooks/useOrdenIngresoForm.ts
import { useEffect, useMemo } from "react";
// 1. Importamos Resolver además de SubmitHandler
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  useCreateOrdenIngreso,
  useOrdenIngreso,
  useUpdateOrdenIngreso,
} from "@/hooks/use-ordenes-ingreso";
import {
  createOrdenSchema,
  updateOrdenSchema,
  CreateOrdenFormData,
  UpdateOrdenFormData,
} from "../schemas/ordenIngresoSchema";

type OrdenFormValues = CreateOrdenFormData | UpdateOrdenFormData;

export function useOrdenIngresoForm(ordenId: string | null) {
  const router = useRouter();
  const isEditing = !!ordenId;

  const createMutation = useCreateOrdenIngreso();
  const updateMutation = useUpdateOrdenIngreso();

  const { data: orden, isLoading: isLoadingOrden } = useOrdenIngreso(
    isEditing ? Number(ordenId) : null
  );

  const form = useForm<OrdenFormValues>({
    // 2. Solución clave: Hacemos cast del resolver a Resolver<OrdenFormValues>
    // Esto resuelve el conflicto entre 'unknown' del preprocess y 'number' del tipo
    resolver: zodResolver(
      isEditing ? updateOrdenSchema : createOrdenSchema
    ) as Resolver<OrdenFormValues>,
    defaultValues: isEditing
      ? {}
      : {
          estado: "pendiente",
        },
  });

  const { watch, setValue, reset } = form;

  const pesoBruto = watch("peso_bruto");
  const pesoTara = watch("peso_tara");

  const pesoNetoCalculado = useMemo(() => {
    if (pesoBruto && pesoTara) {
      return Number((pesoBruto - pesoTara).toFixed(2));
    }
    return undefined;
  }, [pesoBruto, pesoTara]);

  useEffect(() => {
    if (pesoNetoCalculado !== undefined) {
      setValue("peso_neto", pesoNetoCalculado);
    }
  }, [pesoNetoCalculado, setValue]);

  useEffect(() => {
    if (isEditing && orden) {
      reset({
        peso_bruto: orden.peso_bruto ? Number(orden.peso_bruto) : undefined,
        peso_tara: orden.peso_tara ? Number(orden.peso_tara) : undefined,
        peso_neto: orden.peso_neto ? Number(orden.peso_neto) : undefined,
        peso_liquido: orden.peso_liquido
          ? Number(orden.peso_liquido)
          : undefined,
        porcentaje_humedad: orden.porcentaje_humedad
          ? Number(orden.porcentaje_humedad)
          : undefined,
        porcentaje_impureza: orden.porcentaje_impureza
          ? Number(orden.porcentaje_impureza)
          : undefined,
        peso_hectolitrico: orden.peso_hectolitrico
          ? Number(orden.peso_hectolitrico)
          : undefined,
        porcentaje_grano_danado: orden.porcentaje_grano_danado
          ? Number(orden.porcentaje_grano_danado)
          : undefined,
        porcentaje_grano_verde: orden.porcentaje_grano_verde
          ? Number(orden.porcentaje_grano_verde)
          : undefined,
        observaciones: orden.observaciones,
      });
    }
  }, [isEditing, orden, reset]);

  const onSubmit: SubmitHandler<OrdenFormValues> = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: Number(ordenId),
          dto: data as UpdateOrdenFormData,
        });
      } else {
        console.log(data);
        await createMutation.mutateAsync(data as CreateOrdenFormData);
      }
      router.push("/ordenes-ingreso");
    } catch (error) {
      console.error("Error al guardar orden:", error);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingOrden;

  return {
    form,
    orden,
    isEditing,
    isLoading,
    isLoadingOrden,
    pesoNetoCalculado,
    onSubmit,
  };
}
