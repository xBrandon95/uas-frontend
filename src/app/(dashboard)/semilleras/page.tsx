"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/semilleras/semillera-columns";
import { SemilleraDataTable } from "@/components/semilleras/semillera-data-table";
import { SemilleraFormDialog } from "@/components/semilleras/semillera-form-dialog";
import { DeleteSemilleraDialog } from "@/components/semilleras/delete-semillera-dialog";
import {
  useSemilleras,
  useToggleSemilleraActive,
} from "@/hooks/use-semilleras";
import { Button } from "@/components/ui/button";
import { Store, Plus } from "lucide-react";
import { Semillera } from "@/types";
import { SemilleraDetailDialog } from "@/components/semilleras/semillera-detail-dialog";

export default function SemillerasPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSemilleraId, setSelectedSemilleraId] = useState<number | null>(
    null
  );
  const [semilleraToDelete, setSemilleraToDelete] = useState<Semillera | null>(
    null
  );

  const { data, isLoading, isError, error } = useSemilleras({
    page,
    limit,
    search,
  });
  const toggleActiveMutation = useToggleSemilleraActive();

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
    setSelectedSemilleraId(null);
    setFormDialogOpen(true);
  };

  const handleView = (semillera: Semillera) => {
    setSelectedSemilleraId(semillera.id_semillera);
    setDetailDialogOpen(true);
  };

  const handleEdit = (semillera: Semillera) => {
    setSelectedSemilleraId(semillera.id_semillera);
    setFormDialogOpen(true);
  };

  const handleToggleActive = async (semillera: Semillera) => {
    await toggleActiveMutation.mutateAsync(semillera.id_semillera);
  };

  const handleDelete = (semillera: Semillera) => {
    setSemilleraToDelete(semillera);
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
        title="Error al cargar las semilleras"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Semilleras</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona el registro de empresas semilleras
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Semillera
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <SemilleraDataTable
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

      <SemilleraDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        semilleraId={selectedSemilleraId}
      />

      <SemilleraFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        semilleraId={selectedSemilleraId}
      />

      <DeleteSemilleraDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        semillera={semilleraToDelete}
      />
    </>
  );
}
