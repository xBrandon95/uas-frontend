"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/semillas/semilla-columns";
import { SemillaDataTable } from "@/components/semillas/semilla-data-table";
import { SemillaFormDialog } from "@/components/semillas/semilla-form-dialog";
import { DeleteSemillaDialog } from "@/components/semillas/delete-semilla-dialog";
import { useSemillas } from "@/hooks/use-semillas";
import { useToggleSemillaActive } from "@/hooks/use-semillas";
import { Button } from "@/components/ui/button";
import { Wheat, Plus } from "lucide-react";
import { Semilla } from "@/types";
import { SemillaDetailDialog } from "@/components/semillas/semilla-detail-dialog";

export default function SemillasSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSemillaId, setSelectedSemillaId] = useState<number | null>(
    null
  );
  const [semillaToDelete, setSemillaToDelete] = useState<Semilla | null>(null);

  const { data, isLoading, isError, error } = useSemillas({
    page,
    limit,
    search,
  });
  const toggleActiveMutation = useToggleSemillaActive();

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
    setSelectedSemillaId(null);
    setFormDialogOpen(true);
  };

  const handleView = (semilla: Semilla) => {
    setSelectedSemillaId(semilla.id_semilla);
    setDetailDialogOpen(true);
  };

  const handleEdit = (semilla: Semilla) => {
    setSelectedSemillaId(semilla.id_semilla);
    setFormDialogOpen(true);
  };

  const handleToggleActive = async (semilla: Semilla) => {
    await toggleActiveMutation.mutateAsync(semilla.id_semilla);
  };

  const handleDelete = (semilla: Semilla) => {
    setSemillaToDelete(semilla);
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
        title="Error al cargar las semillas"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Semillas</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona el catálogo de semillas disponibles
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Semilla
          </Button>
        </div>

        <SemillaDataTable
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

      <SemillaDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        semillaId={selectedSemillaId}
      />

      <SemillaFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        semillaId={selectedSemillaId}
      />

      <DeleteSemillaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        semilla={semillaToDelete}
      />
    </>
  );
}
