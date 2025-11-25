"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/ordenes-ingreso/orden-ingreso-columns";
import { OrdenIngresoDataTable } from "@/components/ordenes-ingreso/orden-ingreso-data-table";
import { OrdenIngresoDetailDialog } from "@/components/ordenes-ingreso/orden-ingreso-detail-dialog";
import { OrdenLotesDialog } from "@/components/ordenes-ingreso/orden-lotes-dialog"; // ✅ NUEVO
import { ChangeStatusDialog } from "@/components/ordenes-ingreso/change-status-dialog";
import { DeleteOrdenDialog } from "@/components/ordenes-ingreso/delete-orden-dialog";
import { useOrdenesIngreso } from "@/hooks/use-ordenes-ingreso";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { OrdenIngreso } from "@/types";
import { useDescargarReporteOrdenIngreso } from "@/hooks/use-reportes";

export default function OrdenesIngresoPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [lotesDialogOpen, setLotesDialogOpen] = useState(false); // ✅ NUEVO
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);
  const [ordenToChangeStatus, setOrdenToChangeStatus] =
    useState<OrdenIngreso | null>(null);
  const [ordenToDelete, setOrdenToDelete] = useState<OrdenIngreso | null>(null);

  const { data, isLoading, isError, error } = useOrdenesIngreso({
    page,
    limit,
    search,
  });

  // Hook para descargar el reporte PDF
  const descargarReporte = useDescargarReporteOrdenIngreso();

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
    router.push("/ordenes-ingreso/form");
  };

  const handleView = (orden: OrdenIngreso) => {
    setSelectedOrdenId(orden.id_orden_ingreso);
    setDetailDialogOpen(true);
  };

  // ✅ NUEVO: Handler para ver lotes
  const handleViewLotes = (orden: OrdenIngreso) => {
    setSelectedOrdenId(orden.id_orden_ingreso);
    setLotesDialogOpen(true);
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
    onViewLotes: handleViewLotes,
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
        title="Error al cargar las órdenes de ingreso"
      />
    );

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

        <div className="bg-card rounded-lg border p-6">
          <OrdenIngresoDataTable
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

      {/* Dialog de Detalle */}
      <OrdenIngresoDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        ordenId={selectedOrdenId}
      />

      {/* Dialog de Lotes */}
      <OrdenLotesDialog
        open={lotesDialogOpen}
        onOpenChange={setLotesDialogOpen}
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
