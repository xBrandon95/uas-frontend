"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { useLotesDisponibles } from "@/hooks/use-lotes-produccion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PackageCheck, Search, Eye, ArrowLeft } from "lucide-react";
import { LoteProduccion } from "@/types";
import { LoteDetailDialog } from "@/components/lotes-produccion/lote-produccion-detail-dialog";

export default function LotesDisponiblesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: lotes, isLoading, isError, error } = useLotesDisponibles();

  const handleViewDetail = (lote: LoteProduccion) => {
    setSelectedLoteId(lote.id_lote_produccion);
    setDetailDialogOpen(true);
  };

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar los lotes disponibles"
      />
    );

  // Filtrar lotes por búsqueda
  const lotesFiltrados = lotes?.filter((lote) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lote.nro_lote.toLowerCase().includes(searchLower) ||
      lote.variedad?.nombre.toLowerCase().includes(searchLower) ||
      lote.categoria_salida?.nombre.toLowerCase().includes(searchLower) ||
      lote.presentacion?.toLowerCase().includes(searchLower)
    );
  });

  // Calcular totales
  const totales = lotesFiltrados?.reduce(
    (acc, lote) => ({
      unidades: acc.unidades + lote.cantidad_unidades,
      kg: acc.kg + Number(lote.total_kg),
      lotes: acc.lotes + 1,
    }),
    { unidades: 0, kg: 0, lotes: 0 }
  );

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/lotes-produccion")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <PackageCheck className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold tracking-tight">
              Lotes Disponibles
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Listado de lotes disponibles para venta
          </p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Lotes</p>
            <p className="text-3xl font-bold text-green-600">
              {totales?.lotes || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Bolsas</p>
            <p className="text-3xl font-bold text-blue-600">
              {totales?.unidades || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Kg</p>
            <p className="text-3xl font-bold text-primary font-mono">
              {totales?.kg || "0.00"}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por lote, variedad, categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Lote</TableHead>
                  <TableHead>Variedad</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Presentación</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                  <TableHead className="text-right">Kg/Unidad</TableHead>
                  <TableHead className="text-right">Total Kg</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotesFiltrados && lotesFiltrados.length > 0 ? (
                  lotesFiltrados.map((lote) => (
                    <TableRow key={lote.id_lote_produccion}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono font-semibold"
                        >
                          {lote.nro_lote}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {lote.variedad?.nombre}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {lote.categoria_salida?.nombre}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {lote.presentacion || "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {lote.cantidad_unidades}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {Number(lote.kg_por_unidad)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {Number(lote.total_kg)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {lote.unidad?.nombre}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(lote)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {searchTerm
                        ? `No se encontraron lotes para "${searchTerm}"`
                        : "No hay lotes disponibles"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info de resultados */}
          {lotesFiltrados && lotesFiltrados.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {lotesFiltrados.length} de {lotes?.length || 0} lotes
              disponibles
            </div>
          )}
        </div>
      </div>

      <LoteDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        loteId={selectedLoteId}
      />
    </>
  );
}
