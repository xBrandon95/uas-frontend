"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Pencil,
  Download,
  Eye,
  FileText,
  Lock,
  Package,
} from "lucide-react";
import { OrdenIngreso } from "@/types";
import { useDescargarReporteOrdenIngreso } from "@/hooks/use-reportes";

interface ColumnsProps {
  onView: (orden: OrdenIngreso) => void;
  onEdit: (orden: OrdenIngreso) => void;
  onChangeStatus: (orden: OrdenIngreso) => void;
  onDelete: (orden: OrdenIngreso) => void;
  onDownloadReport: (ordenId: number) => void;
}

const getEstadoBadge = (estado: string) => {
  const estados: Record<
    string,
    {
      variant: "default" | "admin" | "pending" | "success";
      label: string;
    }
  > = {
    pendiente: { variant: "pending", label: "Pendiente" },
    completado: { variant: "success", label: "Completado" },
    cancelado: { variant: "admin", label: "Cancelado" },
  };

  return estados[estado] || { variant: "default", label: estado };
};

// Componente para manejar los hooks correctamente
function AccionesCell({
  orden,
  onView,
  onEdit,
  onChangeStatus,
}: {
  orden: OrdenIngreso;
  onView: (orden: OrdenIngreso) => void;
  onEdit: (orden: OrdenIngreso) => void;
  onChangeStatus: (orden: OrdenIngreso) => void;
  onDelete: (orden: OrdenIngreso) => void;
}) {
  const router = useRouter();
  const descargarReporte = useDescargarReporteOrdenIngreso();

  // Verificar si puede editarse/eliminarse
  const tieneLotsProduccion = (orden as any).tiene_lotes_produccion || false;
  const cantidadLotes = (orden as any).cantidad_lotes || 0;
  const estaCompletado = orden.estado === "completado";
  const estaEnProceso = orden.estado === "en_proceso";
  const estaCancelado = orden.estado === "cancelado";
  const puedeEditar =
    !tieneLotsProduccion && !estaCompletado && !estaEnProceso && !estaCancelado;

  // Mensaje de tooltip para editar
  const mensajeEditar = !puedeEditar
    ? tieneLotsProduccion
      ? `No puede editarse: tiene ${cantidadLotes} lote(s) de producción asociado(s)`
      : "No se puede editar"
    : "Editar orden de ingreso";

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

        {/* Lotes de Producción - Navegar a página */}
        <DropdownMenuItem
          onClick={() =>
            router.push(`/ordenes-ingreso/${orden.id_orden_ingreso}/lotes`)
          }
        >
          <Package className="mr-2 h-4 w-4" />
          Lotes
          {cantidadLotes > 0 && (
            <Badge variant="secondary" className="ml-2">
              {cantidadLotes}
            </Badge>
          )}
        </DropdownMenuItem>

        {/* Ver Detalle */}
        <DropdownMenuItem onClick={() => onView(orden)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalle
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Editar - Con validación */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenuItem
                  onClick={() => puedeEditar && onEdit(orden)}
                  disabled={!puedeEditar}
                  className={
                    !puedeEditar ? "opacity-50 cursor-not-allowed" : ""
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                  {!puedeEditar && <Lock className="ml-2 h-3 w-3" />}
                </DropdownMenuItem>
              </div>
            </TooltipTrigger>
            {!puedeEditar && (
              <TooltipContent>
                <p className="max-w-xs">{mensajeEditar}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Cambiar Estado */}
        <DropdownMenuItem onClick={() => onChangeStatus(orden)}>
          <FileText className="mr-2 h-4 w-4" />
          Cambiar Estado
        </DropdownMenuItem>

        {/* Descargar PDF */}
        <DropdownMenuItem
          onClick={() => descargarReporte.mutate(orden.id_orden_ingreso)}
          disabled={descargarReporte.isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          {descargarReporte.isPending ? "Descargando..." : "Descargar PDF"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
    accessorKey: "categoria.nombre",
    header: "Categoría",
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
        <span className="font-mono">{Number(peso).toFixed(2)} kg</span>
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
      const orden = row.original as any;
      const tieneLotsProduccion = orden.tiene_lotes_produccion || false;
      const cantidadLotes = orden.cantidad_lotes || 0;
      const esEstadoFinal = estado === "completado" || estado === "cancelado";

      return (
        <div className="flex items-center gap-2">
          <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
          {esEstadoFinal && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Lock className="h-3 w-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estado final - No se puede modificar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {tieneLotsProduccion && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Lock className="h-3 w-3" />
                    {cantidadLotes}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tiene {cantidadLotes} lote(s) de producción</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No puede editarse ni eliminarse
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <AccionesCell
        orden={row.original}
        onView={onView}
        onEdit={onEdit}
        onChangeStatus={onChangeStatus}
        onDelete={onDelete}
      />
    ),
  },
];
