"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/conductores/conductor-columns";
import { ConductorDataTable } from "@/components/conductores/conductor-data-table";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { DeleteConductorDialog } from "@/components/conductores/delete-conductor-dialog";
import { useConductores } from "@/hooks/use-conductores";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import { Conductor } from "@/types";
import { ConductorDetailDialog } from "@/components/conductores/conductor-detail-dialog";

export default function ConductoresPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  const [conductorToDelete, setConductorToDelete] = useState<Conductor | null>(
    null
  );

  const { data, isLoading, isError, error } = useConductores({
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
    setSelectedConductorId(null);
    setFormDialogOpen(true);
  };

  const handleView = (conductor: Conductor) => {
    setSelectedConductorId(conductor.id_conductor);
    setDetailDialogOpen(true);
  };

  const handleEdit = (conductor: Conductor) => {
    setSelectedConductorId(conductor.id_conductor);
    setFormDialogOpen(true);
  };

  const handleDelete = (conductor: Conductor) => {
    setConductorToDelete(conductor);
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
        title="Error al cargar los conductores"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Conductores</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona la información de los conductores
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Conductor
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <ConductorDataTable
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

      <ConductorDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        conductorId={selectedConductorId}
      />

      <ConductorFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        conductorId={selectedConductorId}
      />

      <DeleteConductorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conductor={conductorToDelete}
      />
    </>
  );
}
