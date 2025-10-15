"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/variedades/variedad-columns";
import { VariedadDataTable } from "@/components/variedades/variedad-data-table";
import { VariedadFormDialog } from "@/components/variedades/variedad-form-dialog";
import { DeleteVariedadDialog } from "@/components/variedades/delete-variedad-dialog";
import { useVariedades } from "@/hooks/use-variedades";
import { Button } from "@/components/ui/button";
import { Sprout, Plus } from "lucide-react";
import { Variedad } from "@/types";
import { VariedadDetailDialog } from "@/components/variedades/variedad-detail-dialog";

export default function VariedadesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVariedadId, setSelectedVariedadId] = useState<number | null>(
    null
  );
  const [variedadToDelete, setVariedadToDelete] = useState<Variedad | null>(
    null
  );

  const { data, isLoading, isError, error } = useVariedades({
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
    setSelectedVariedadId(null);
    setFormDialogOpen(true);
  };

  const handleView = (variedad: Variedad) => {
    setSelectedVariedadId(variedad.id_variedad);
    setDetailDialogOpen(true);
  };

  const handleEdit = (variedad: Variedad) => {
    setSelectedVariedadId(variedad.id_variedad);
    setFormDialogOpen(true);
  };

  const handleDelete = (variedad: Variedad) => {
    setVariedadToDelete(variedad);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar las variedades"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Variedades</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona las variedades de semillas disponibles
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Variedad
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <VariedadDataTable
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

      <VariedadDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        variedadId={selectedVariedadId}
      />

      <VariedadFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        variedadId={selectedVariedadId}
      />

      <DeleteVariedadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        variedad={variedadToDelete}
      />
    </>
  );
}
