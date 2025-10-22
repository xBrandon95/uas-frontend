"use client";

import { useState } from "react";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { createColumns } from "@/components/categorias/categoria-columns";
import { CategoriaDataTable } from "@/components/categorias/categoria-data-table";
import { CategoriaFormDialog } from "@/components/categorias/categoria-form-dialog";
import { DeleteCategoriaDialog } from "@/components/categorias/delete-categoria-dialog";
import { useCategorias } from "@/hooks/use-categorias";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";
import { Categoria } from "@/types";
import { CategoriaDetailDialog } from "@/components/categorias/categoria-detail-dialog";

export default function CategoriasSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Modales
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(
    null
  );
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(
    null
  );

  const { data, isLoading, isError, error } = useCategorias({
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
    setSelectedCategoriaId(null);
    setFormDialogOpen(true);
  };

  const handleView = (categoria: Categoria) => {
    setSelectedCategoriaId(categoria.id_categoria);
    setDetailDialogOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoriaId(categoria.id_categoria);
    setFormDialogOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
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
        title="Error al cargar las categorías"
      />
    );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
            </div>

            <p className="text-muted-foreground mt-2">
              Gestiona las categorías de semillas
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        <CategoriaDataTable
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

      <CategoriaDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        categoriaId={selectedCategoriaId}
      />

      <CategoriaFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        categoriaId={selectedCategoriaId}
      />

      <DeleteCategoriaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoria={categoriaToDelete}
      />
    </>
  );
}
