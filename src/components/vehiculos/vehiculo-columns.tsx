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
import { Vehiculo } from "@/types";

interface ColumnsProps {
  onView: (vehiculo: Vehiculo) => void;
  onEdit: (vehiculo: Vehiculo) => void;
  onDelete: (vehiculo: Vehiculo) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Vehiculo>[] => [
  {
    accessorKey: "marca_modelo",
    header: "Vehículo",
    cell: ({ row }) => {
      const marca_modelo = row.getValue("marca_modelo") as string;
      return marca_modelo ? (
        <span className="font-medium">{marca_modelo}</span>
      ) : (
        <span className="text-muted-foreground text-sm">Sin marca</span>
      );
    },
  },
  {
    accessorKey: "placa",
    header: "Placa",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono font-semibold text-base">
        {row.getValue("placa")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehiculo = row.original;

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
            <DropdownMenuItem onClick={() => onView(vehiculo)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(vehiculo)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(vehiculo)}
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
