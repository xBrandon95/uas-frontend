"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  FileText,
  Wheat,
  Scale,
  Tag,
  Loader2,
  History,
  ArrowLeft,
} from "lucide-react";
import { useLoteProduccion } from "@/hooks/use-lotes-produccion";
import {
  useMovimientosByLote,
  useResumenMovimientos,
} from "@/hooks/use-movimientos-lote";
import { MovimientosTable } from "@/components/lotes-produccion/movimientos-table";
import { ResumenMovimientosCard } from "@/components/lotes-produccion/resumen-movimientos";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";

export default function LoteDetalleViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loteId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("detalles");

  const {
    data: lote,
    isLoading,
    isError,
    error,
  } = useLoteProduccion(loteId ? Number(loteId) : null);
  const { data: movimientos, isLoading: isLoadingMovimientos } =
    useMovimientosByLote(loteId ? Number(loteId) : null);
  const { data: resumen, isLoading: isLoadingResumen } = useResumenMovimientos(
    loteId ? Number(loteId) : null
  );

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-BO");
  };

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage message={error.message} title="Error al cargar el lote" />
    );

  if (!lote) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontró el lote</p>
          <Button
            variant="outline"
            onClick={() => router.push("/lotes-produccion")}
            className="mt-4"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/lotes-produccion")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Lotes de Producción
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalle del Lote
            </h1>
            <p className="text-muted-foreground mt-1">
              Información completa del lote de producción
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {lote.estado}
          </Badge>
        </div>
      </div>

      {/* Encabezado del Lote */}
      <div className="bg-card rounded-lg border p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Número de Lote</p>
            <p className="text-2xl font-bold font-mono">{lote.nro_lote}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Fecha de Producción</p>
            <p className="text-sm font-medium">
              {formatDate(lote.fecha_produccion)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
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

        {/* TAB: DETALLES */}
        <TabsContent value="detalles" className="space-y-4">
          {/* Grid 2 columnas para aprovechar espacio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Orden de Ingreso */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <FileText className="h-4 w-4" />
                Orden de Ingreso
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Número</p>
                  <p className="font-mono font-semibold">
                    {lote.orden_ingreso?.numero_orden || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del Producto */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Wheat className="h-4 w-4" />
                Producto
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Variedad</p>
                  <p className="font-medium text-sm">{lote.variedad?.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Categoría</p>
                  <Badge variant="outline" className="text-xs">
                    {lote.categoria_salida?.nombre}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Presentación</p>
                  <p className="font-medium text-sm">
                    {lote.presentacion || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Servicio</p>
                  <p className="font-medium text-sm">
                    {lote.tipo_servicio || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cantidades - Full Width pero compacto */}
          <div className="bg-card rounded-lg border p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Scale className="h-4 w-4" />
              Cantidades
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Unidades</p>
                <p className="text-xl font-bold">{lote.cantidad_unidades}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Kg/Unidad</p>
                <p className="text-xl font-bold font-mono">
                  {Number(lote.kg_por_unidad).toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-xs text-muted-foreground mb-1">Total Kg</p>
                <p className="text-xl font-bold font-mono text-primary">
                  {Number(lote.total_kg).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Información Adicional - Grid 2 columnas */}
          <div className="bg-card rounded-lg border p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Tag className="h-4 w-4" />
              Información Adicional
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Unidad</p>
                <p className="font-medium text-sm">{lote.unidad?.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Fecha Producción
                </p>
                <p className="font-medium text-sm">
                  {formatDate(lote.fecha_produccion)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Creado por</p>
                <p className="font-medium text-sm">
                  {lote.usuario_creador?.nombre || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha Creación</p>
                <p className="font-medium text-sm">
                  {formatDate(lote.fecha_creacion)}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: MOVIMIENTOS */}
        <TabsContent value="movimientos" className="space-y-4">
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

          <div className="bg-card rounded-lg border p-4">
            <h3 className="text-base font-semibold mb-3">
              Historial de Movimientos
            </h3>
            {isLoadingMovimientos ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : movimientos ? (
              <MovimientosTable movimientos={movimientos} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay movimientos registrados
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
