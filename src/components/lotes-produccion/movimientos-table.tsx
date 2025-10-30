"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { MovimientoLote } from "@/types";

interface MovimientosTableProps {
  movimientos: MovimientoLote[];
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "entrada":
      return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
    case "salida":
      return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
    case "ajuste":
      return <AlertCircle className="h-4 w-4 text-blue-600" />;
    case "merma":
      return <Trash2 className="h-4 w-4 text-orange-600" />;
    default:
      return null;
  }
};

const getTipoBadge = (tipo: string) => {
  const configs = {
    entrada: {
      variant: "default" as const,
      label: "Entrada",
      color: "bg-green-100 text-green-800",
    },
    salida: {
      variant: "destructive" as const,
      label: "Salida",
      color: "bg-red-100 text-red-800",
    },
    ajuste: {
      variant: "secondary" as const,
      label: "Ajuste",
      color: "bg-blue-100 text-blue-800",
    },
    merma: {
      variant: "outline" as const,
      label: "Merma",
      color: "bg-orange-100 text-orange-800",
    },
  };
  return (
    configs[tipo as keyof typeof configs] || {
      variant: "secondary" as const,
      label: tipo,
    }
  );
};

export function MovimientosTable({ movimientos }: MovimientosTableProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay movimientos registrados para este lote
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Unidades</TableHead>
            <TableHead className="text-right">Kg Movidos</TableHead>
            <TableHead className="text-right">Saldo Unidades</TableHead>
            <TableHead className="text-right">Saldo Kg</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimientos.map((movimiento) => {
            const tipoBadge = getTipoBadge(movimiento.tipo_movimiento);
            return (
              <TableRow key={movimiento.id_movimiento}>
                <TableCell className="font-mono text-xs">
                  {formatDate(movimiento.fecha_movimiento)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTipoIcon(movimiento.tipo_movimiento)}
                    <Badge variant={tipoBadge.variant} className="text-xs">
                      {tipoBadge.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span
                    className={
                      movimiento.tipo_movimiento === "entrada"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {movimiento.tipo_movimiento === "entrada" ? "+" : "-"}
                    {movimiento.cantidad_unidades}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span
                    className={
                      movimiento.tipo_movimiento === "entrada"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {movimiento.tipo_movimiento === "entrada" ? "+" : "-"}
                    {Number(movimiento.kg_movidos).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {movimiento.saldo_unidades}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold">
                  {Number(movimiento.saldo_kg).toFixed(2)}
                </TableCell>
                <TableCell className="text-sm">
                  {movimiento.usuario?.nombre || "N/A"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {movimiento.orden_salida ? (
                    <div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {movimiento.orden_salida.numero_orden}
                      </Badge>
                    </div>
                  ) : (
                    movimiento.observaciones || "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
