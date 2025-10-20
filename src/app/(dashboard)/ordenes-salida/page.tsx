"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { useOrdenesSalida } from "@/hooks/use-ordenes-salida";
import { Button } from "@/components/ui/button";
import { TruckIcon, Plus } from "lucide-react";
import { OrdenSalida } from "@/types";

export default function OrdenesSalidaPage() {
  const router = useRouter();
  const { data: ordenes, isLoading, isError, error } = useOrdenesSalida();

  const handleCreate = () => {
    router.push("/ordenes-salida/form");
  };

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar las órdenes de salida"
      />
    );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TruckIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Órdenes de Salida
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Gestiona las órdenes de salida y ventas de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <p className="text-center text-muted-foreground">
          Tabla de órdenes en construcción...
        </p>
        <p className="text-sm text-center mt-2">
          Total de órdenes: {ordenes?.length || 0}
        </p>
      </div>
    </div>
  );
}
