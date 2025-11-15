"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, ShieldAlert } from "lucide-react";
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
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OrdenIngresoFormPage() {
  const { user } = useAuthStore();
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

  useEffect(() => {
    if (isEditing && orden && user) {
      const esAdmin = user.rol === "admin";
      const esEncargado = user.rol === "encargado";
      const puedeEditarPorRol = esAdmin || esEncargado;
      const esPendiente = orden.estado === "pendiente";

      // Si no puede editar, mostrar alerta y volver
      if (!puedeEditarPorRol || !esPendiente) {
        // Redirigir después de 3 segundos
        setTimeout(() => {
          router.push("/ordenes-ingreso");
        }, 3000);
      }
    }
  }, [isEditing, orden, user, router]);

  const puedeEditar = () => {
    if (!isEditing || !user || !orden) return true; // Crear siempre permitido

    const esAdmin = user.rol === "admin";
    const esEncargado = user.rol === "encargado";
    const puedeEditarPorRol = esAdmin || esEncargado;
    const esPendiente = orden.estado === "pendiente";

    return puedeEditarPorRol && esPendiente;
  };

  if (isLoadingOrden && isEditing) {
    return <Loader />;
  }

  if (isEditing && orden && !puedeEditar()) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">
              ⛔ No tienes permisos para editar esta orden
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              {user?.rol === "operador" && (
                <li>Solo administradores y encargados pueden editar órdenes</li>
              )}
              {orden.estado !== "pendiente" && (
                <li>{`Solo se pueden editar órdenes en estado "Pendiente"`}</li>
              )}
            </ul>
            <p className="text-xs mt-3 text-muted-foreground">
              Serás redirigido en 3 segundos...
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
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
