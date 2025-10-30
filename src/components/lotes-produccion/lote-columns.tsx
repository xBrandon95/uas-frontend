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
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, FileCheck } from "lucide-react";
import { LoteProduccion } from "@/types";

interface ColumnsProps {
  onView: (lote: LoteProduccion) => void;
  onEdit: (lote: LoteProduccion) => void;
  onChangeStatus: (lote: LoteProduccion) => void;
  onDelete: (lote: LoteProduccion) => void;
}

const getEstadoBadge = (estado: string) => {
  const estados: Record<
    string,
    {
      variant: "default" | "success" | "admin" | "pending";
      label: string;
    }
  > = {
    disponible: { variant: "success", label: "Disponible" },
    parcialmente_vendido: { variant: "pending", label: "Parcial" },
    vendido: { variant: "admin", label: "Vendido" },
    reservado: { variant: "pending", label: "Reservado" },
    descartado: { variant: "admin", label: "Descartado" },
  };

  return estados[estado] || { variant: "secondary", label: estado };
};

export const createColumns = ({
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}: ColumnsProps): ColumnDef<LoteProduccion>[] => [
  {
    accessorKey: "nro_lote",
    header: "Nº Lote",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono font-semibold">
        {row.getValue("nro_lote")}
      </Badge>
    ),
  },
  {
    accessorKey: "variedad.semilla.nombre",
    header: "Semilla",
    cell: ({ row }) => {
      const semilla = row.original.variedad?.semilla?.nombre;
      return (
        <Badge variant="secondary" className="uppercase">
          {semilla || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "variedad.nombre",
    header: "Variedad",
    cell: ({ row }) => {
      const variedad = row.original.variedad;
      return <span className="font-medium">{variedad?.nombre || "N/A"}</span>;
    },
  },
  {
    accessorKey: "categoria_salida.nombre",
    header: "Categoría",
    cell: ({ row }) => {
      const categoria = row.original.categoria_salida;
      return <Badge variant="outline">{categoria?.nombre || "N/A"}</Badge>;
    },
  },
  {
    accessorKey: "cantidad_unidades",
    header: "Unidades",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("cantidad_unidades")}</span>
    ),
  },
  {
    accessorKey: "kg_por_unidad",
    header: "Kg/Unidad",
    cell: ({ row }) => {
      const kg = row.getValue("kg_por_unidad") as number;
      return <span className="font-mono">{kg} kg</span>;
    },
  },
  {
    accessorKey: "total_kg",
    header: "Total Kg",
    cell: ({ row }) => {
      const total = row.getValue("total_kg") as number;
      return <span className="font-mono font-semibold">{total} kg</span>;
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
    header: "Fecha Prod.",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_creacion");
      if (!fecha) return <span className="text-muted-foreground">-</span>;
      return new Date(fecha as string).toLocaleDateString("es-BO");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lote = row.original;

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
            <DropdownMenuItem onClick={() => onView(lote)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(lote)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus(lote)}>
              <FileCheck className="mr-2 h-4 w-4" />
              Cambiar Estado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(lote)}
              className="text-red-600"
              disabled={lote.estado === "vendido"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
