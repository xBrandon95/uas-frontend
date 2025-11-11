"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  FileCheck,
  Download,
} from "lucide-react";
import { OrdenSalida } from "@/types";

interface ColumnsProps {
  onView: (orden: OrdenSalida) => void;
  onEdit: (orden: OrdenSalida) => void;
  onChangeStatus: (orden: OrdenSalida) => void;
  onDelete: (orden: OrdenSalida) => void;
  onDownloadReport: (ordenId: number) => void;
}

const getEstadoBadge = (estado: string) => {
  const estados: Record<
    string,
    {
      variant: "default" | "admin" | "success" | "pending";
      label: string;
    }
  > = {
    pendiente: { variant: "pending", label: "Pendiente" },
    en_transito: { variant: "default", label: "En Tránsito" },
    completado: { variant: "success", label: "Completado" },
    cancelado: { variant: "admin", label: "Cancelado" },
  };

  return estados[estado] || { variant: "secondary", label: estado };
};

export const createColumns = ({
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
  onDownloadReport,
}: ColumnsProps): ColumnDef<OrdenSalida>[] => [
  {
    accessorKey: "numero_orden",
    header: "Nº Orden",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono font-semibold">
        {row.getValue("numero_orden")}
      </Badge>
    ),
  },
  {
    accessorKey: "cliente.nombre",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return <span className="font-medium">{cliente?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "semillera.nombre",
    header: "Semillera",
    cell: ({ row }) => {
      const semillera = row.original.semillera;
      return <span>{semillera?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "semilla.nombre",
    header: "Semilla",
    cell: ({ row }) => {
      const semilla = row.original.semilla;
      return (
        <Badge variant="secondary" className="uppercase">
          {semilla?.nombre || "N/A"}
        </Badge>
      );
    },
  },
  {
    id: "total_unidades",
    header: "Total Unidades",
    cell: ({ row }) => {
      const unidades = row.original.detalles.reduce(
        (sum, d) => sum + d.cantidad_unidades,
        0
      );
      return <span className="font-mono">{unidades}</span>;
    },
  },
  {
    id: "total_kg",
    header: "Total Kg",
    cell: ({ row }) => {
      const kg = row.original.detalles
        .reduce((sum, d) => sum + Number(d.total_kg), 0)
        .toFixed(2);
      return <span className="font-mono font-semibold">{kg}</span>;
    },
  },
  {
    id: "costo_servicio",
    header: "Costo Servicio",
    cell: ({ row }) => {
      const costo = row.original.total_costo_servicio;
      if (!costo || costo === 0) {
        return <span className="text-muted-foreground text-xs">-</span>;
      }
      return (
        <span className="font-mono text-sm">
          Bs. {Number(costo).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "fecha_creacion",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_creacion") as string;
      return new Date(fecha).toLocaleDateString("es-BO");
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string;
      const estadoConfig = getEstadoBadge(estado);
      return <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const orden = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(orden)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(orden)}
              disabled={orden.estado === "completado"}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus(orden)}>
              <FileCheck className="mr-2 h-4 w-4" />
              Cambiar Estado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDownloadReport(orden.id_orden_salida)}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar Reporte
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(orden)}
              className="text-red-600"
              disabled={orden.estado === "completado"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
