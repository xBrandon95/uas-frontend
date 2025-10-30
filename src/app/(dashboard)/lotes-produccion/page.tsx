"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/lotes-produccion/lote-columns";
import { LoteDataTable } from "@/components/lotes-produccion/lote-produccion-data-table";
import { LoteDetailDialog } from "@/components/lotes-produccion/lote-produccion-detail-dialog";
import { ChangeStatusDialog } from "@/components/lotes-produccion/change-status-dialog";
import { DeleteLoteDialog } from "@/components/lotes-produccion/delete-lote-dialog";
import { useLotesProduccion } from "@/hooks/use-lotes-produccion";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { LoteProduccion } from "@/types";

export default function LotesProduccionPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);
  const [loteToChangeStatus, setLoteToChangeStatus] =
    useState<LoteProduccion | null>(null);
  const [loteToDelete, setLoteToDelete] = useState<LoteProduccion | null>(null);

  const {
    data: lotes,
    isLoading,
    isError,
    error,
  } = useLotesProduccion({
    page,
    limit,
    search,
  });

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
    router.push("/lotes-produccion/form");
  };

  const handleView = (lote: LoteProduccion) => {
    router.push(`/lotes-produccion/detalle?id=${lote.id_lote_produccion}`);
  };

  const handleEdit = (lote: LoteProduccion) => {
    router.push(`/lotes-produccion/form?id=${lote.id_lote_produccion}`);
  };

  const handleChangeStatus = (lote: LoteProduccion) => {
    setLoteToChangeStatus(lote);
    setStatusDialogOpen(true);
  };

  const handleDelete = (lote: LoteProduccion) => {
    setLoteToDelete(lote);
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
        title="Error al cargar los lotes de producción"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Lotes de Producción
              </h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Gestiona los lotes de producción generados desde las órdenes de
              ingreso
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/lotes-produccion/disponibles")}
            >
              Ver Disponibles
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/lotes-produccion/inventario")}
            >
              Inventario
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Lote
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <LoteDataTable
            columns={columns}
            data={lotes?.data || []}
            meta={
              lotes?.meta || {
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

      <LoteDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        loteId={selectedLoteId}
      />

      <ChangeStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        lote={loteToChangeStatus}
      />

      <DeleteLoteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lote={loteToDelete}
      />
    </>
  );
}
