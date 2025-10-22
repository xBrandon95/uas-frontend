"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/ordenes-salida/orden-salida-columns";
import { OrdenSalidaDetailDialog } from "@/components/ordenes-salida/orden-salida-detail-dialog";
import { ChangeStatusDialog } from "@/components/ordenes-salida/change-status-dialog";
import { DeleteOrdenDialog } from "@/components/ordenes-salida/delete-orden-dialog";
import { useOrdenesSalida } from "@/hooks/use-ordenes-salida";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TruckIcon, Plus } from "lucide-react";
import { OrdenSalida } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function OrdenesSalidaPage() {
  const router = useRouter();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);
  const [ordenToChangeStatus, setOrdenToChangeStatus] =
    useState<OrdenSalida | null>(null);
  const [ordenToDelete, setOrdenToDelete] = useState<OrdenSalida | null>(null);

  const { data: ordenes, isLoading, isError, error } = useOrdenesSalida();

  const handleCreate = () => {
    router.push("/ordenes-salida/form");
  };

  const handleView = (orden: OrdenSalida) => {
    setSelectedOrdenId(orden.id_orden_salida);
    setDetailDialogOpen(true);
  };

  const handleEdit = (orden: OrdenSalida) => {
    router.push(`/ordenes-salida/form?id=${orden.id_orden_salida}`);
  };

  const handleChangeStatus = (orden: OrdenSalida) => {
    setOrdenToChangeStatus(orden);
    setStatusDialogOpen(true);
  };

  const handleDelete = (orden: OrdenSalida) => {
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
        title="Error al cargar las órdenes de salida"
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

  // Calcular totales
  const totalBolsas = ordenes?.reduce((sum, orden) => {
    return sum + orden.detalles.reduce((s, d) => s + d.nro_bolsas, 0);
  }, 0);

  const totalKg = ordenes?.reduce((sum, orden) => {
    return sum + orden.detalles.reduce((s, d) => s + d.total_kg, 0);
  }, 0);

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TruckIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Órdenes de Salida
              </h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona las órdenes de salida y ventas de semillas
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Órdenes</p>
            <p className="text-3xl font-bold text-primary">
              {ordenes?.length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Bolsas</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalBolsas || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Kg</p>
            <p className="text-3xl font-bold text-green-600 font-mono">
              {totalKg?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Semillera</TableHead>
                <TableHead>Fecha Salida</TableHead>
                <TableHead>Total Bolsas</TableHead>
                <TableHead>Total Kg</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes && ordenes.length > 0 ? (
                ordenes.map((orden) => {
                  const estadoConfig = getEstadoBadge(orden.estado);
                  const bolsas = orden.detalles.reduce(
                    (s, d) => s + d.nro_bolsas,
                    0
                  );
                  const kg = orden.detalles.reduce((s, d) => s + d.total_kg, 0);

                  return (
                    <TableRow key={orden.id_orden_salida}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono font-semibold"
                        >
                          {orden.numero_orden}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {orden.cliente?.nombre || "N/A"}
                      </TableCell>
                      <TableCell>{orden.semillera?.nombre || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(orden.fecha_salida).toLocaleDateString(
                          "es-BO"
                        )}
                      </TableCell>
                      <TableCell className="font-mono">{bolsas}</TableCell>
                      <TableCell className="font-mono font-semibold">
                        {kg.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoConfig.variant}>
                          {estadoConfig.label}
                        </Badge>
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
                    No se encontraron órdenes de salida
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrdenSalidaDetailDialog
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
