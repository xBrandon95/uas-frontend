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
import { MoreHorizontal, Pencil, Power, Trash2, Eye } from "lucide-react";
import { Semilla } from "@/types";

interface ColumnsProps {
  onView: (semilla: Semilla) => void;
  onEdit: (semilla: Semilla) => void;
  onToggleActive: (semilla: Semilla) => void;
  onDelete: (semilla: Semilla) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: ColumnsProps): ColumnDef<Semilla>[] => [
  // {
  //   accessorKey: "id_semilla",
  //   header: "ID",
  //   cell: ({ row }) => (
  //     <div className="font-medium">{row.getValue("id_semilla")}</div>
  //   ),
  // },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombre")}</div>
    ),
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const activo = row.getValue("activo") as boolean;
      return (
        <Badge variant={activo ? "success" : "secondary"}>
          {activo ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const semilla = row.original;

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
            <DropdownMenuItem onClick={() => onView(semilla)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(semilla)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(semilla)}>
              <Power className="mr-2 h-4 w-4" />
              {semilla.activo ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(semilla)}
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
