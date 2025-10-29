"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, TrendingUp, Weight, CheckCircle2 } from "lucide-react";

interface OrdenProgresoCardProps {
  ordenIngreso: {
    numero_orden: string;
    peso_neto: number;
    estado: string;
  };
  produccion: {
    total_kg_producido: string;
    total_unidades_producidas: number;
    cantidad_lotes: number;
    peso_disponible: string;
    porcentaje_utilizado: string;
  };
}

export function OrdenProgresoCard({
  ordenIngreso,
  produccion,
}: OrdenProgresoCardProps) {
  const porcentaje = parseFloat(produccion.porcentaje_utilizado);
  const estaCompleto = porcentaje >= 100;

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: "bg-yellow-500",
      en_proceso: "bg-blue-500",
      completado: "bg-green-500",
      cancelado: "bg-red-500",
    };
    return colores[estado] || "bg-gray-500";
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
      cancelado: "Cancelado",
    };
    return labels[estado] || estado;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Progreso de Producción</CardTitle>
          <Badge
            variant={estaCompleto ? "default" : "secondary"}
            className="gap-1"
          >
            {estaCompleto && <CheckCircle2 className="h-3 w-3" />}
            {getEstadoLabel(ordenIngreso.estado)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Peso Utilizado</span>
            <span className="font-semibold">{porcentaje.toFixed(1)}%</span>
          </div>
          <Progress
            value={porcentaje}
            className="h-3"
            indicatorClassName={estaCompleto ? "bg-green-500" : "bg-blue-500"}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{produccion.total_kg_producido} kg producidos</span>
            <span>{ordenIngreso.peso_neto} kg total</span>
          </div>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mb-1" />
            <p className="text-2xl font-bold">
              {produccion.total_unidades_producidas}
            </p>
            <p className="text-xs text-muted-foreground">Unidades</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-3">
            <Weight className="h-5 w-5 text-green-600 mb-1" />
            <p className="text-2xl font-bold font-mono">
              {parseFloat(produccion.peso_disponible).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Kg Disponibles</p>
          </div>
        </div>

        {/* Alerta si está completo o cerca */}
        {porcentaje >= 95 && porcentaje < 100 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
            <p className="font-semibold">⚠️ Cerca del límite</p>
            <p className="text-xs mt-1">
              Solo quedan {produccion.peso_disponible} kg disponibles
            </p>
          </div>
        )}

        {estaCompleto && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
            <p className="font-semibold">✅ Orden completada</p>
            <p className="text-xs mt-1">
              Se utilizó el 100% del peso neto de la orden
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
