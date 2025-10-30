"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  FileText,
  Wheat,
  Scale,
  Tag,
  Loader2,
  History,
} from "lucide-react";
import { useLoteProduccion } from "@/hooks/use-lotes-produccion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMovimientosByLote,
  useResumenMovimientos,
} from "@/hooks/use-movimientos-lote";
import { useState } from "react";
import { MovimientosTable } from "./movimientos-table";
import { ResumenMovimientosCard } from "./resumen-movimientos";

interface LoteDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loteId: number | null;
}

export function LoteDetailDialog({
  open,
  onOpenChange,
  loteId,
}: LoteDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("detalles");
  const { data: lote, isLoading } = useLoteProduccion(loteId);
  const { data: movimientos, isLoading: isLoadingMovimientos } =
    useMovimientosByLote(loteId);
  const { data: resumen, isLoading: isLoadingResumen } =
    useResumenMovimientos(loteId);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-BO");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle del Lote de Producción
          </DialogTitle>
          <DialogDescription>Información completa del lote</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        ) : lote ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detalles">
                <Package className="h-4 w-4 mr-2" />
                Detalles
              </TabsTrigger>
              <TabsTrigger value="movimientos">
                <History className="h-4 w-4 mr-2" />
                Historial
                {movimientos && (
                  <Badge variant="secondary" className="ml-2">
                    {movimientos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* TAB: DETALLES (contenido existente) */}
            <TabsContent value="detalles" className="space-y-6">
              {/* Encabezado */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Número de Lote
                  </p>
                  <p className="text-2xl font-bold font-mono">
                    {lote.nro_lote}
                  </p>
                </div>
                <Badge>{lote.estado}</Badge>
              </div>

              <Separator />

              <div className="space-y-6">
                {/* Orden de Ingreso */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <FileText className="h-4 w-4" />
                    Orden de Ingreso Origen
                  </h3>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Número de Orden
                    </p>
                    <p className="font-semibold font-mono">
                      {lote.orden_ingreso?.numero_orden || "N/A"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Información del Producto */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Wheat className="h-4 w-4" />
                    Información del Producto
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Variedad</p>
                      <p className="font-medium">{lote.variedad?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categoría</p>
                      <Badge variant="outline">
                        {lote.categoria_salida?.nombre}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Presentación
                      </p>
                      <p className="font-medium">
                        {lote.presentacion || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tipo de Servicio
                      </p>
                      <p className="font-medium">
                        {lote.tipo_servicio || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Cantidades */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Scale className="h-4 w-4" />
                    Cantidades
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        Nº Unidades
                      </p>
                      <p className="text-2xl font-bold">
                        {lote.cantidad_unidades}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Kg/Unidad</p>
                      <p className="text-2xl font-bold font-mono">
                        {Number(lote.kg_por_unidad).toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4">
                      <p className="text-sm text-muted-foreground">Total Kg</p>
                      <p className="text-2xl font-bold font-mono text-primary">
                        {Number(lote.total_kg).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Información Adicional */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Tag className="h-4 w-4" />
                    Información Adicional
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Unidad</p>
                      <p className="font-medium">{lote.unidad?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha Producción
                      </p>
                      <p className="font-medium">
                        {formatDate(lote.fecha_produccion)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Creado por
                      </p>
                      <p className="font-medium">
                        {lote.usuario_creador?.nombre || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha Creación
                      </p>
                      <p className="font-medium">
                        {formatDate(lote.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ... resto del contenido existente de detalles ... */}
              {/* (Mantener todo el código existente del dialog) */}
            </TabsContent>

            {/* TAB: MOVIMIENTOS (NUEVO) */}
            <TabsContent value="movimientos" className="space-y-6">
              {isLoadingResumen ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : resumen ? (
                <ResumenMovimientosCard
                  resumen={resumen}
                  cantidadOriginal={lote.cantidad_original}
                  totalKgOriginal={Number(lote.total_kg_original)}
                />
              ) : null}

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Historial de Movimientos
                </h3>
                {isLoadingMovimientos ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : movimientos ? (
                  <MovimientosTable movimientos={movimientos} />
                ) : null}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No se encontraron datos del lote
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
