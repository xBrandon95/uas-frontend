"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/ordenes-salida/orden-salida-columns";
import { OrdenSalidaDataTable } from "@/components/ordenes-salida/orden-salida-data-table";
import { OrdenSalidaDetailDialog } from "@/components/ordenes-salida/orden-salida-detail-dialog";
import { ChangeStatusDialog } from "@/components/ordenes-salida/change-status-dialog";
import { DeleteOrdenDialog } from "@/components/ordenes-salida/delete-orden-dialog";
import { useOrdenesSalida } from "@/hooks/use-ordenes-salida";
import { Button } from "@/components/ui/button";
import { TruckIcon, Plus } from "lucide-react";
import { OrdenSalida } from "@/types";
import { useDescargarReporteOrdenSalida } from "@/hooks/use-reportes";

export default function OrdenesSalidaPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);
  const [ordenToChangeStatus, setOrdenToChangeStatus] =
    useState<OrdenSalida | null>(null);
  const [ordenToDelete, setOrdenToDelete] = useState<OrdenSalida | null>(null);

  const { data, isLoading, isError, error } = useOrdenesSalida();

    // Hook para descargar el reporte PDF
    const descargarReporte = useDescargarReporteOrdenSalida();
  
    // Handler para usarlo dentro de las columnas
    const handleDownloadReport = (ordenId: number) => {
      descargarReporte.mutate(ordenId);
    };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

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
    onDownloadReport: handleDownloadReport,
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar las órdenes de salida"
      />
    );

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
              Gestiona las órdenes de salida y ventas de productos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <OrdenSalidaDataTable
            columns={columns}
            data={data?.data || []}
            meta={
              data?.meta || {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
              }
            }
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearchChange={handleSearchChange}
            searchValue={search}
          />
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
