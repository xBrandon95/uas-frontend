"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/cooperadores/cooperador-columns";
import { CooperadorDataTable } from "@/components/cooperadores/cooperador-data-table";
import { CooperadorFormDialog } from "@/components/cooperadores/cooperador-form-dialog";
import { DeleteCooperadorDialog } from "@/components/cooperadores/delete-cooperador-dialog";
import { useCooperadores } from "@/hooks/use-cooperadores";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Cooperador } from "@/types";
import { CooperadorDetailDialog } from "@/components/cooperadores/cooperador-detail-dialog";

export default function CooperadoresPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCooperadorId, setSelectedCooperadorId] = useState<
    number | null
  >(null);
  const [cooperadorToDelete, setCooperadorToDelete] =
    useState<Cooperador | null>(null);

  const { data, isLoading, isError, error } = useCooperadores({
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
    setSelectedCooperadorId(null);
    setFormDialogOpen(true);
  };

  const handleView = (cooperador: Cooperador) => {
    setSelectedCooperadorId(cooperador.id_cooperador);
    setDetailDialogOpen(true);
  };

  const handleEdit = (cooperador: Cooperador) => {
    setSelectedCooperadorId(cooperador.id_cooperador);
    setFormDialogOpen(true);
  };

  const handleDelete = (cooperador: Cooperador) => {
    setCooperadorToDelete(cooperador);
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
        title="Error al cargar los cooperadores"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Cooperadores
              </h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona los cooperadores registrados en el sistema
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cooperador
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <CooperadorDataTable
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

      <CooperadorDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        cooperadorId={selectedCooperadorId}
      />

      <CooperadorFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        cooperadorId={selectedCooperadorId}
      />

      <DeleteCooperadorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cooperador={cooperadorToDelete}
      />
    </>
  );
}
