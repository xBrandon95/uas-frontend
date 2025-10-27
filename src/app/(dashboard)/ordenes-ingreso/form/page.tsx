// src/app/(dashboard)/ordenes-ingreso/form/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useOrdenIngresoForm } from "@/components/ordenes-ingreso/hooks/useOrdenIngresoForm";
import { useQuickCreateDialogs } from "@/components/ordenes-ingreso/hooks/useQuickCreateDialogs";
import {
  TransporteSection,
  SemillaSection,
  PesajeSection,
  LaboratorioSection,
  ObservacionesSection,
  ReadOnlyTransporte,
  ReadOnlySemilla,
  FormDialogs,
} from "@/components/ordenes-ingreso/form";

export default function OrdenIngresoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("id");

  const {
    form,
    orden,
    isEditing,
    isLoading,
    isLoadingOrden,
    pesoNetoCalculado,
    onSubmit,
  } = useOrdenIngresoForm(ordenId);

  const { dialogs } = useQuickCreateDialogs();

  if (isLoadingOrden && isEditing) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/ordenes-ingreso")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Editar Orden de Ingreso" : "Nueva Orden de Ingreso"}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Secciones de solo lectura en modo edición */}
        {isEditing && orden ? (
          <>
            <ReadOnlyTransporte orden={orden} />
            <ReadOnlySemilla orden={orden} />
          </>
        ) : (
          <>
            <TransporteSection form={form} dialogs={dialogs} />
            <SemillaSection form={form} dialogs={dialogs} />
          </>
        )}

        {/* Secciones siempre editables */}
        <PesajeSection
          form={form}
          pesoNetoCalculado={pesoNetoCalculado}
          isEditing={isEditing}
        />
        <LaboratorioSection form={form} isEditing={isEditing} />
        <ObservacionesSection form={form} isEditing={isEditing} />

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/ordenes-ingreso")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Actualizar" : "Crear"} Orden
          </Button>
        </div>
      </form>

      {/* Diálogos de creación rápida */}
      <FormDialogs dialogs={dialogs} />
    </div>
  );
}
