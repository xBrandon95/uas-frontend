"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Plus, Pencil, Loader2, AlertCircle } from "lucide-react";
import { useOrdenIngreso } from "@/hooks/use-ordenes-ingreso";
import { useLotesByOrdenIngreso } from "@/hooks/use-lotes-produccion";
import { LoteFormDialog } from "@/components/lotes-produccion/lote-form-dialog";

interface OrdenLotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenId: number | null;
}

export function OrdenLotesDialog({
  open,
  onOpenChange,
  ordenId,
}: OrdenLotesDialogProps) {
  const [loteFormOpen, setLoteFormOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);

  const { data: orden, isLoading: isLoadingOrden } = useOrdenIngreso(ordenId);
  const { data: lotes, isLoading: isLoadingLotes } =
    useLotesByOrdenIngreso(ordenId);

  const handleCreateLote = () => {
    setSelectedLoteId(null);
    setLoteFormOpen(true);
  };

  const handleEditLote = (loteId: number) => {
    setSelectedLoteId(loteId);
    setLoteFormOpen(true);
  };

  const puedeCrearLotes =
    orden?.estado === "pendiente" || orden?.estado === "en_proceso";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lotes de Producción
            </DialogTitle>
            <DialogDescription>
              Gestiona los lotes creados desde la orden{" "}
              {orden && (
                <Badge variant="outline" className="font-mono ml-1">
                  {orden.numero_orden}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoadingOrden ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
          ) : orden ? (
            <div className="space-y-4">
              {/* Información de la Orden */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Semillera</p>
                    <p className="font-medium">{orden.semillera?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Semilla</p>
                    <p className="font-medium">{orden.semilla?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Variedad</p>
                    <p className="font-medium">{orden.variedad?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Peso Neto</p>
                    <p className="font-medium font-mono">
                      {Number(orden.peso_neto).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>

              {/* Alerta si no puede crear lotes */}
              {!puedeCrearLotes && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    <p className="font-semibold">⚠️ Orden finalizada</p>
                    <p className="text-sm mt-1">
                      No se pueden crear más lotes porque la orden está en
                      estado: <strong>{orden.estado}</strong>
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Header con botón crear */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Lotes Creados
                  {lotes && (
                    <Badge variant="secondary" className="ml-3">
                      {lotes.length}
                    </Badge>
                  )}
                </h3>
                {puedeCrearLotes && (
                  <Button onClick={handleCreateLote} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Lote
                  </Button>
                )}
              </div>

              {/* Tabla de Lotes */}
              {isLoadingLotes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : lotes && lotes.length > 0 ? (
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
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotes.map((lote) => (
                        <TableRow key={lote.id_lote_produccion}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {lote.nro_lote}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {lote.variedad?.nombre}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
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
                            {Number(lote.kg_por_unidad).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {Number(lote.total_kg).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{lote.estado}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditLote(lote.id_lote_produccion)
                                }
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No hay lotes creados
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza creando el primer lote de producción para esta
                    orden
                  </p>
                  {puedeCrearLotes && (
                    <Button onClick={handleCreateLote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Lote
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron datos de la orden
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para crear/editar lote */}
      {ordenId && (
        <LoteFormDialog
          open={loteFormOpen}
          onOpenChange={setLoteFormOpen}
          ordenId={ordenId}
          loteId={selectedLoteId}
        />
      )}
    </>
  );
}
