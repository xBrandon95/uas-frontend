"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/clientes/cliente-columns";
import { ClienteDataTable } from "@/components/clientes/cliente-data-table";
import { ClienteFormDialog } from "@/components/clientes/cliente-form-dialog";
import { DeleteClienteDialog } from "@/components/clientes/delete-cliente-dialog";
import { ClienteDetailDialog } from "@/components/clientes/cliente-detail-dialog";
import { useClientes } from "@/hooks/use-clientes";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Cliente } from "@/types";

export default function ClientesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null
  );
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  const { data, isLoading, isError, error } = useClientes({
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
    setSelectedClienteId(null);
    setFormDialogOpen(true);
  };

  const handleView = (cliente: Cliente) => {
    setSelectedClienteId(cliente.id_cliente);
    setDetailDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedClienteId(cliente.id_cliente);
    setFormDialogOpen(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
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
        title="Error al cargar los clientes"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona la información de los clientes
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <ClienteDataTable
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

      <ClienteDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        clienteId={selectedClienteId}
      />

      <ClienteFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        clienteId={selectedClienteId}
      />

      <DeleteClienteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cliente={clienteToDelete}
      />
    </>
  );
}
