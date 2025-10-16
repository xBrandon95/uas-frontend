"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/ordenes-ingreso/orden-ingreso-columns";
import { OrdenIngresoDetailDialog } from "@/components/ordenes-ingreso/orden-ingreso-detail-dialog";
import { ChangeStatusDialog } from "@/components/ordenes-ingreso/change-status-dialog";
import { DeleteOrdenDialog } from "@/components/ordenes-ingreso/delete-orden-dialog";
import { useOrdenesIngreso } from "@/hooks/use-ordenes-ingreso";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus } from "lucide-react";
import { OrdenIngreso } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function OrdenesIngresoPage() {
  const router = useRouter();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);
  const [ordenToChangeStatus, setOrdenToChangeStatus] =
    useState<OrdenIngreso | null>(null);
  const [ordenToDelete, setOrdenToDelete] = useState<OrdenIngreso | null>(null);

  const { data: ordenes, isLoading, isError, error } = useOrdenesIngreso();

  const handleCreate = () => {
    router.push("/ordenes-ingreso/form");
  };

  const handleView = (orden: OrdenIngreso) => {
    setSelectedOrdenId(orden.id_orden_ingreso);
    setDetailDialogOpen(true);
  };

  const handleEdit = (orden: OrdenIngreso) => {
    router.push(`/ordenes-ingreso/form?id=${orden.id_orden_ingreso}`);
  };

  const handleChangeStatus = (orden: OrdenIngreso) => {
    setOrdenToChangeStatus(orden);
    setStatusDialogOpen(true);
  };

  const handleDelete = (orden: OrdenIngreso) => {
    setOrdenToDelete(orden);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onChangeStatus: handleChangeStatus,
    onDelete: handleDelete,
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar las órdenes de ingreso"
      />
    );

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

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Órdenes de Ingreso
              </h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona las órdenes de ingreso de semillas
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Orden</TableHead>
                <TableHead>Semillera</TableHead>
                <TableHead>Cooperador</TableHead>
                <TableHead>Semilla</TableHead>
                <TableHead>Peso Neto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes && ordenes.length > 0 ? (
                ordenes.map((orden) => {
                  const estadoConfig = getEstadoBadge(orden.estado);
                  return (
                    <TableRow key={orden.id_orden_ingreso}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono font-semibold"
                        >
                          {orden.numero_orden}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {orden.semillera?.nombre || "N/A"}
                      </TableCell>
                      <TableCell>{orden.cooperador?.nombre || "N/A"}</TableCell>
                      <TableCell>{orden.semilla?.nombre || "N/A"}</TableCell>
                      <TableCell>
                        {orden.peso_neto ? (
                          <span className="font-mono">
                            {orden.peso_neto.toFixed(2)} kg
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoConfig.variant}>
                          {estadoConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(orden.fecha_creacion).toLocaleDateString(
                          "es-BO"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(orden)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(orden)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChangeStatus(orden)}
                          >
                            Estado
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(orden)}
                            className="text-red-600"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron órdenes de ingreso
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrdenIngresoDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        ordenId={selectedOrdenId}
      />

      <ChangeStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        orden={ordenToChangeStatus}
      />

      <DeleteOrdenDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        orden={ordenToDelete}
      />
    </>
  );
}
