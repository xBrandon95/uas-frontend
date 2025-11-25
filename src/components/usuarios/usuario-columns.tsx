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
import { MoreHorizontal, Pencil, Power, Eye } from "lucide-react";
import { Usuario } from "@/types";

interface ColumnsProps {
  onView: (usuario: Usuario) => void;
  onEdit: (usuario: Usuario) => void;
  onToggleActive: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const getRoleBadge = (rol: string) => {
  const variants = {
    admin: "admin",
    encargado: "encargado",
    operador: "operador",
  } as const;

  const labels = {
    admin: "Admin",
    encargado: "Encargado",
    operador: "Operador",
  };

  return (
    <Badge variant={variants[rol as keyof typeof variants] || "secondary"}>
      {labels[rol as keyof typeof labels] || rol}
    </Badge>
  );
};

export const createColumns = ({
  onView,
  onEdit,
  onToggleActive,
}: // onDelete,
ColumnsProps): ColumnDef<Usuario>[] => [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("usuario")}</div>
    ),
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => getRoleBadge(row.getValue("rol")),
  },
  {
    accessorKey: "unidad",
    header: "Unidad",
    cell: ({ row }) => {
      const unidad = row.original.unidad;
      return unidad ? (
        <span className="text-sm">{unidad.nombre}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Sin unidad</span>
      );
    },
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
    accessorKey: "fecha_creacion",
    header: "Fecha Creación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha_creacion"));
      return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const usuario = row.original;

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
            <DropdownMenuItem onClick={() => onView(usuario)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(usuario)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(usuario)}>
              <Power className="mr-2 h-4 w-4" />
              {usuario.activo ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
