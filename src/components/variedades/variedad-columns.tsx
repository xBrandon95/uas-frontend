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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Variedad } from "@/types";

interface ColumnsProps {
  onView: (variedad: Variedad) => void;
  onEdit: (variedad: Variedad) => void;
  onDelete: (variedad: Variedad) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Variedad>[] => [
  {
    accessorKey: "semilla.nombre",
    header: "Semilla",
    cell: ({ row }) => {
      const semilla = row.original.semilla;
      return (
        <div className="font-medium uppercase">{semilla?.nombre || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "nombre",
    header: "Variedad",
    cell: ({ row }) => (
      <div className="font-medium uppercase">{row.getValue("nombre")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const variedad = row.original;

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
            <DropdownMenuItem onClick={() => onView(variedad)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(variedad)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(variedad)}
              className="text-red-600"
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
