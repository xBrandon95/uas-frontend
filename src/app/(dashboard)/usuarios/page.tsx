"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/usuarios/usuario-columns";
import { UsuarioDataTable } from "@/components/usuarios/usuario-data-table";
import { UsuarioFormDialog } from "@/components/usuarios/usuario-form-dialog";
import { DeleteUsuarioDialog } from "@/components/usuarios/delete-usuario-dialog";
import { UsuarioDetailDialog } from "@/components/usuarios/usuario-detail-dialog";
import { useUsuarios, useToggleUsuarioActive } from "@/hooks/use-usuarios";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Usuario } from "@/types";

export default function UsuariosPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(
    null
  );
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  const { data, isLoading, isError, error } = useUsuarios({
    page,
    limit,
    search,
  });
  const toggleActiveMutation = useToggleUsuarioActive();

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
    setSelectedUsuarioId(null);
    setFormDialogOpen(true);
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuarioId(usuario.id_usuario);
    setDetailDialogOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuarioId(usuario.id_usuario);
    setFormDialogOpen(true);
  };

  const handleToggleActive = async (usuario: Usuario) => {
    await toggleActiveMutation.mutateAsync(usuario.id_usuario);
  };

  const handleDelete = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
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
        title="Error al cargar los usuarios"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            </div>
            <p className="text-muted-foreground">
              Gestiona los usuarios del sistema y sus permisos
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Usuario
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <UsuarioDataTable
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

      <UsuarioDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        usuarioId={selectedUsuarioId}
      />

      <UsuarioFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        usuarioId={selectedUsuarioId}
      />

      <DeleteUsuarioDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        usuario={usuarioToDelete}
      />
    </>
  );
}
