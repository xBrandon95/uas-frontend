"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/unidades/unidad-columns";
import { UnidadDataTable } from "@/components/unidades/unidad-data-table";
import { UnidadFormDialog } from "@/components/unidades/unidad-form-dialog";
import { DeleteUnidadDialog } from "@/components/unidades/delete-unidad-dialog";
import { useUnidades } from "@/hooks/use-unidades";
import { useToggleUnidadActive } from "@/hooks/use-unidades";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Unidad } from "@/types";
import { UnidadDetailDialog } from "@/components/unidades/unidad-detail-dialog";

export default function UnidadesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | null>(null);
  const [unidadToDelete, setUnidadToDelete] = useState<Unidad | null>(null);

  const { data, isLoading, isError, error } = useUnidades({
    page,
    limit,
    search,
  });
  const toggleActiveMutation = useToggleUnidadActive();

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
    setSelectedUnidadId(null);
    setFormDialogOpen(true);
  };

  const handleView = (unidad: Unidad) => {
    setSelectedUnidadId(unidad.id_unidad);
    setDetailDialogOpen(true);
  };

  const handleEdit = (unidad: Unidad) => {
    setSelectedUnidadId(unidad.id_unidad);
    setFormDialogOpen(true);
  };

  const handleToggleActive = async (unidad: Unidad) => {
    await toggleActiveMutation.mutateAsync(unidad.id_unidad);
  };

  const handleDelete = (unidad: Unidad) => {
    setUnidadToDelete(unidad);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onToggleActive: handleToggleActive,
    onDelete: handleDelete,
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar las unidades"
      />
    );

  return (
    <>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona las unidades acondicionadoras de semilla
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Unidad
          </Button>
        </div>

        <UnidadDataTable
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

      <UnidadDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        unidadId={selectedUnidadId}
      />

      <UnidadFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        unidadId={selectedUnidadId}
      />

      <DeleteUnidadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        unidad={unidadToDelete}
      />
    </>
  );
}
