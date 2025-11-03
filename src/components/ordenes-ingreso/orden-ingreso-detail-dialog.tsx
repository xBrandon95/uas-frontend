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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Truck,
  Wheat,
  Scale,
  Loader2,
  Package,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useOrdenIngreso } from "@/hooks/use-ordenes-ingreso";
import { useResumenProduccion } from "@/hooks/use-orden-resumen";
import { useLotesByOrdenIngreso } from "@/hooks/use-lotes-produccion";
import { OrdenProgresoCard } from "@/components/ordenes-ingreso/ordenes-progreso-card";
import { LoteFormDialog } from "@/components/lotes-produccion/lote-form-dialog";

interface OrdenIngresoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordenId: number | null;
}

export function OrdenIngresoDetailDialog({
  open,
  onOpenChange,
  ordenId,
}: OrdenIngresoDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("detalles");
  const [loteFormOpen, setLoteFormOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null);

  const { data: orden, isLoading } = useOrdenIngreso(ordenId);
  const { data: resumen, isLoading: isLoadingResumen } =
    useResumenProduccion(ordenId);
  const { data: lotes, isLoading: isLoadingLotes } =
    useLotesByOrdenIngreso(ordenId);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("es-BO");
  };

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
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalle de Orden de Ingreso
            </DialogTitle>
            <DialogDescription>
              Información completa de la orden y sus lotes de producción
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
          ) : orden ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detalles">
                  <FileText className="h-4 w-4 mr-2" />
                  Detalles
                </TabsTrigger>
                <TabsTrigger value="lotes">
                  <Package className="h-4 w-4 mr-2" />
                  Lotes de Producción
                  {lotes && (
                    <Badge variant="secondary" className="ml-2">
                      {lotes.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* TAB: DETALLES */}
              <TabsContent value="detalles" className="space-y-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Número de Orden
                    </p>
                    <p className="text-2xl font-bold font-mono">
                      {orden.numero_orden}
                    </p>
                  </div>
                  <Badge>{orden.estado}</Badge>
                </div>

                <Separator />

                {/* Progreso de Producción */}
                {resumen && !isLoadingResumen && (
                  <>
                    <OrdenProgresoCard
                      ordenIngreso={resumen.orden_ingreso}
                      produccion={resumen.produccion}
                    />
                    <Separator />
                  </>
                )}

                {/* Transporte */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Truck className="h-4 w-4" />
                    Información de Transporte
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Semillera</p>
                      <p className="font-medium">{orden.semillera?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cooperador
                      </p>
                      <p className="font-medium">{orden.cooperador?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conductor</p>
                      <p className="font-medium">{orden.conductor?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vehículo</p>
                      <p className="font-medium font-mono">
                        {orden.vehiculo?.marca_modelo} - {orden.vehiculo?.placa}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Semilla */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Wheat className="h-4 w-4" />
                    Información de Semilla
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Semilla</p>
                      <p className="font-medium">{orden.semilla?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Variedad</p>
                      <p className="font-medium">{orden.variedad?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categoría</p>
                      <p className="font-medium">
                        {orden.categoria_ingreso?.nombre}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pesaje */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Scale className="h-4 w-4" />
                    Datos de Pesaje
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Peso Bruto
                      </p>
                      <p className="font-medium font-mono">
                        {Number(orden.peso_bruto).toFixed(2) || "-"} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso Tara</p>
                      <p className="font-medium font-mono">
                        {Number(orden.peso_tara).toFixed(2) || "-"} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso Neto</p>
                      <p className="font-medium font-mono">
                        {Number(orden.peso_neto).toFixed(2) || "-"} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Peso Líquido
                      </p>
                      <p className="font-medium font-mono">
                        {Number(orden.peso_liquido).toFixed(2) || "-"} kg
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Laboratorio */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    Análisis de Laboratorio
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">% Humedad</p>
                      <p className="font-medium">
                        {Number(orden.porcentaje_humedad).toFixed(2) || "-"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        % Impureza
                      </p>
                      <p className="font-medium">
                        {Number(orden.porcentaje_impureza).toFixed(2) || "-"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        % Grano Dañado
                      </p>
                      <p className="font-medium">
                        {Number(orden.porcentaje_grano_danado).toFixed(2) ||
                          "-"}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        % Grano Verde
                      </p>
                      <p className="font-medium">
                        {Number(orden.porcentaje_grano_verde).toFixed(2) || "-"}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {orden.observaciones && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Observaciones
                      </p>
                      <p className="text-sm">{orden.observaciones}</p>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* TAB: LOTES DE PRODUCCIÓN */}
              <TabsContent value="lotes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Lotes de Producción
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gestiona los lotes creados desde esta orden
                    </p>
                  </div>
                  {puedeCrearLotes && (
                    <Button onClick={handleCreateLote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Lote
                    </Button>
                  )}
                </div>

                {!puedeCrearLotes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                    <p className="font-semibold">⚠️ Orden finalizada</p>
                    <p className="mt-1">
                      No se pueden crear más lotes porque la orden está en
                      estado: <strong>{orden.estado}</strong>
                    </p>
                  </div>
                )}

                <Separator />

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
                          <TableHead className="text-right">
                            Kg/Unidad
                          </TableHead>
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
              </TabsContent>
            </Tabs>
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
