"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/vehiculos/vehiculo-columns";
import { VehiculoDataTable } from "@/components/vehiculos/vehiculo-data-table";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";
import { DeleteVehiculoDialog } from "@/components/vehiculos/delete-vehiculo-dialog";
import { useVehiculos } from "@/hooks/use-vehiculos";
import { Button } from "@/components/ui/button";
import { Truck, Plus } from "lucide-react";
import { Vehiculo } from "@/types";
import { VehiculoDetailDialog } from "@/components/vehiculos/vehiculo-detail-dialog";

export default function VehiculosPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<number | null>(
    null
  );
  const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(
    null
  );

  const { data, isLoading, isError, error } = useVehiculos({
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
    setSelectedVehiculoId(null);
    setFormDialogOpen(true);
  };

  const handleView = (vehiculo: Vehiculo) => {
    setSelectedVehiculoId(vehiculo.id_vehiculo);
    setDetailDialogOpen(true);
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculoId(vehiculo.id_vehiculo);
    setFormDialogOpen(true);
  };

  const handleDelete = (vehiculo: Vehiculo) => {
    setVehiculoToDelete(vehiculo);
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
        title="Error al cargar los vehículos"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona el registro de vehículos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Vehículo
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <VehiculoDataTable
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

      <VehiculoDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        vehiculoId={selectedVehiculoId}
      />

      <VehiculoFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        vehiculoId={selectedVehiculoId}
      />

      <DeleteVehiculoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        vehiculo={vehiculoToDelete}
      />
    </>
  );
}
