"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  Activity,
} from "lucide-react";
import { ResumenMovimientos } from "@/types";

interface ResumenMovimientosProps {
  resumen: ResumenMovimientos;
  cantidadOriginal?: number;
  totalKgOriginal?: number;
}

export function ResumenMovimientosCard({
  resumen,
  cantidadOriginal,
  totalKgOriginal,
}: ResumenMovimientosProps) {
  const porcentajeVendido = totalKgOriginal
    ? ((resumen.total_salidas / totalKgOriginal) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {/* Total Entradas */}
      <Card>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Entradas</p>
              <p className="text-xl font-bold text-green-600">
                {resumen.total_entradas.toFixed(2)} kg
              </p>
              {cantidadOriginal && (
                <p className="text-xs text-muted-foreground mt-1">
                  {cantidadOriginal} unidades
                </p>
              )}
            </div>
            <ArrowDownCircle className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Total Salidas */}
      <Card>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Salidas</p>
              <p className="text-xl font-bold text-red-600">
                {resumen.total_salidas.toFixed(2)} kg
              </p>
              {totalKgOriginal && (
                <p className="text-xs text-muted-foreground mt-1">
                  {porcentajeVendido}% vendido
                </p>
              )}
            </div>
            <ArrowUpCircle className="h-8 w-8 text-red-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Saldo Actual */}
      <Card>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Actual</p>
              <p className="text-xl font-bold text-primary">
                {resumen.saldo_actual.toFixed(2)} kg
              </p>
              <p className="text-xs text-muted-foreground mt-1">Disponible</p>
            </div>
            <Package className="h-8 w-8 text-primary opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Movimientos */}
      <Card>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Movimientos</p>
              <p className="text-xl font-bold">
                {resumen.cantidad_movimientos}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Registros</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
