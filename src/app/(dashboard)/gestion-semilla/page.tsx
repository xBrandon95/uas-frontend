"use client";

import { Wheat } from "lucide-react";
import VariedadesSection from "@/components/variedades/variedad-section";
import SemillasSection from "@/components/semillas/semilla-section";
import CategoriasSection from "@/components/categorias/categoria-section";

export default function GestionSemillasPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Wheat className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Semillas, Variedades y Categorías
        </h1>
      </div>

      <div className="bg-card border rounded-lg px-4">
        <VariedadesSection />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg px-4">
          <SemillasSection />
        </div>

        <div className="bg-card border rounded-lg px-4">
          <CategoriasSection />
        </div>
      </div>
    </div>
  );
}
