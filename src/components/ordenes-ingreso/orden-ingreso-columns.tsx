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
import { MoreHorizontal, Pencil, Trash2, Eye, FileCheck } from "lucide-react";
import { OrdenIngreso } from "@/types";

interface ColumnsProps {
  onView: (orden: OrdenIngreso) => void;
  onEdit: (orden: OrdenIngreso) => void;
  onChangeStatus: (orden: OrdenIngreso) => void;
  onDelete: (orden: OrdenIngreso) => void;
}

const getEstadoBadge = (estado: string) => {
  const estados: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    pendiente: { variant: "secondary", label: "Pendiente" },
    en_proceso: { variant: "default", label: "En Proceso" },
    completado: { variant: "outline", label: "Completado" },
    cancelado: { variant: "destructive", label: "Cancelado" },
  };

  return estados[estado] || { variant: "secondary", label: estado };
};

export const createColumns = ({
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}: ColumnsProps): ColumnDef<OrdenIngreso>[] => [
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
    accessorKey: "semillera.nombre",
    header: "Semillera",
    cell: ({ row }) => {
      const semillera = row.original.semillera;
      return <span className="font-medium">{semillera?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "cooperador.nombre",
    header: "Cooperador",
    cell: ({ row }) => {
      const cooperador = row.original.cooperador;
      return <span>{cooperador?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "semilla.nombre",
    header: "Semilla",
    cell: ({ row }) => {
      const semilla = row.original.semilla;
      return <span>{semilla?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "variedad.nombre",
    header: "Variedad",
    cell: ({ row }) => {
      const variedad = row.original.variedad;
      return <span>{variedad?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "categoria_ingreso.nombre",
    header: "Categoria",
    cell: ({ row }) => {
      const categoria = row.original.categoria_ingreso;
      return <span>{categoria?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "peso_neto",
    header: "Peso Neto",
    cell: ({ row }) => {
      const peso = row.getValue("peso_neto") as number;
      return peso ? (
        <span className="font-mono flex justify-end">
          {Number(peso).toFixed(2)} kg
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
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
    accessorKey: "fecha_creacion",
    header: "Fecha Creación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha_creacion"));
      return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    id: "actions",
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
            <DropdownMenuItem onClick={() => onEdit(orden)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onChangeStatus(orden)}>
              <FileCheck className="mr-2 h-4 w-4" />
              Cambiar Estado
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onClick={() => onDelete(orden)}
              className="text-red-600"
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
