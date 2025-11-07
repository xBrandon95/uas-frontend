"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { useInventarioVariedad } from "@/hooks/use-lotes-produccion";
import { useAuthStore } from "@/stores/authStore";
import { useAllUnidades } from "@/hooks/use-unidades";
import { useSemillasActivas } from "@/hooks/use-semillas";
import { useVariedadesBySemilla } from "@/hooks/use-variedades";
import { useCategoriasActivas } from "@/hooks/use-categorias";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package2,
  Search,
  TrendingUp,
  Boxes,
  Scale,
  X,
  Building2,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventarioConsolidadoPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSemilla, setFiltroSemilla] = useState<number | undefined>();
  const [filtroVariedad, setFiltroVariedad] = useState<number | undefined>();
  const [filtroCategoria, setFiltroCategoria] = useState<number | undefined>();
  const [filtroUnidad, setFiltroUnidad] = useState<number | undefined>(
    user?.rol === "admin" ? undefined : user?.id_unidad
  );

  // Cargar datos de catálogos
  const { data: unidades } = useAllUnidades();
  const { data: semillas } = useSemillasActivas();
  const { data: variedades } = useVariedadesBySemilla(filtroSemilla || null);
  const { data: categorias } = useCategoriasActivas();

  // ✅ UNA SOLA LLAMADA AL BACKEND CON TODOS LOS FILTROS
  const {
    data: inventario,
    isLoading,
    isError,
    error,
  } = useInventarioVariedad(
    filtroUnidad,
    filtroSemilla,
    filtroVariedad,
    filtroCategoria
  );

  // Filtro local solo para búsqueda por texto (opcional)
  const inventarioFiltrado = useMemo(() => {
    if (!inventario) return [];

    if (!searchTerm.trim()) return inventario;

    const searchLower = searchTerm.toLowerCase();
    return inventario.filter(
      (item) =>
        item.variedad.toLowerCase().includes(searchLower) ||
        item.semilla.toLowerCase().includes(searchLower) ||
        item.categoria.toLowerCase().includes(searchLower)
    );
  }, [inventario, searchTerm]);

  // Calcular totales
  const totales = useMemo(() => {
    return inventarioFiltrado.reduce(
      (acc, item) => ({
        unidades: acc.unidades + Number(item.total_unidades),
        kg: acc.kg + Number(item.total_kg),
        items: acc.items + 1,
      }),
      { unidades: 0, kg: 0, items: 0 }
    );
  }, [inventarioFiltrado]);

  // Verificar si hay filtros activos
  const hayFiltrosActivos =
    !!filtroSemilla ||
    !!filtroVariedad ||
    !!filtroCategoria ||
    searchTerm !== "";

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroSemilla(undefined);
    setFiltroVariedad(undefined);
    setFiltroCategoria(undefined);
    setSearchTerm("");
  };

  // Limpiar variedad cuando cambia la semilla
  const handleSemillaChange = (value: string) => {
    if (value === "all") {
      setFiltroSemilla(undefined);
      setFiltroVariedad(undefined);
    } else {
      setFiltroSemilla(Number(value));
      setFiltroVariedad(undefined); // Resetear variedad
    }
  };

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar el inventario"
      />
    );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Package2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Inventario Consolidado
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          {user?.rol === "admin"
            ? "Vista de inventario de todas las unidades"
            : `Inventario de tu unidad`}
        </p>
      </div>

      {/* Selector de Unidad (solo para Admin) */}
      {user?.rol === "admin" && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Filtrar por Unidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={filtroUnidad?.toString() || "all"}
                onValueChange={(value) =>
                  setFiltroUnidad(value === "all" ? undefined : Number(value))
                }
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Todas las unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las unidades</SelectItem>
                  {unidades?.map((unidad) => (
                    <SelectItem
                      key={unidad.id_unidad}
                      value={unidad.id_unidad.toString()}
                    >
                      {unidad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totales.items}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Variedades × Categorías
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Unidades
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totales.unidades.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En todos los lotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kilogramos
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 font-mono">
              {totales.kg.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Peso total disponible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Tabla */}
      <div className="bg-card rounded-lg border p-6">
        {/* Barra de Filtros */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </h3>
            {hayFiltrosActivos && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda General */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtro Semilla */}
            <div>
              <Select
                value={filtroSemilla?.toString() || "all"}
                onValueChange={handleSemillaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las semillas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las semillas</SelectItem>
                  {semillas?.map((semilla) => (
                    <SelectItem
                      key={semilla.id_semilla}
                      value={semilla.id_semilla.toString()}
                    >
                      {semilla.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Variedad */}
            <div>
              <Select
                value={filtroVariedad?.toString() || "all"}
                onValueChange={(value) =>
                  setFiltroVariedad(value === "all" ? undefined : Number(value))
                }
                disabled={!filtroSemilla}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las variedades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las variedades</SelectItem>
                  {variedades?.map((variedad) => (
                    <SelectItem
                      key={variedad.id_variedad}
                      value={variedad.id_variedad.toString()}
                    >
                      {variedad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Categoría */}
            <div>
              <Select
                value={filtroCategoria?.toString() || "all"}
                onValueChange={(value) =>
                  setFiltroCategoria(
                    value === "all" ? undefined : Number(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias?.map((categoria) => (
                    <SelectItem
                      key={categoria.id_categoria}
                      value={categoria.id_categoria.toString()}
                    >
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Badges de filtros activos */}
          {hayFiltrosActivos && (
            <div className="flex flex-wrap gap-2">
              {filtroSemilla && (
                <Badge variant="secondary" className="gap-1">
                  Semilla:{" "}
                  {semillas?.find((s) => s.id_semilla === filtroSemilla)
                    ?.nombre || filtroSemilla}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleSemillaChange("all")}
                  />
                </Badge>
              )}
              {filtroVariedad && (
                <Badge variant="secondary" className="gap-1">
                  Variedad:{" "}
                  {variedades?.find((v) => v.id_variedad === filtroVariedad)
                    ?.nombre || filtroVariedad}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFiltroVariedad(undefined)}
                  />
                </Badge>
              )}
              {filtroCategoria && (
                <Badge variant="secondary" className="gap-1">
                  Categoría:{" "}
                  {categorias?.find((c) => c.id_categoria === filtroCategoria)
                    ?.nombre || filtroCategoria}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFiltroCategoria(undefined)}
                  />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  {`Búsqueda: "${searchTerm}"`}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Tabla de Inventario */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semilla</TableHead>
                <TableHead>Variedad</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Total Unidades</TableHead>
                <TableHead className="text-right">Total Kg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventarioFiltrado && inventarioFiltrado.length > 0 ? (
                inventarioFiltrado.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.semilla}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {item.variedad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {Number(item.total_unidades).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-green-600">
                      {Number(item.total_kg).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {hayFiltrosActivos
                      ? "No se encontraron resultados con los filtros aplicados"
                      : "No hay inventario disponible"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Info de resultados */}
        {inventarioFiltrado && inventarioFiltrado.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {inventarioFiltrado.length} productos
            </p>
            <div className="text-sm text-muted-foreground">
              Total mostrado:{" "}
              <span className="font-semibold text-foreground">
                {totales.unidades.toLocaleString()} unidades
              </span>{" "}
              |{" "}
              <span className="font-semibold text-foreground">
                {totales.kg.toFixed(2)} kg
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nota informativa */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> Este inventario incluye solo los lotes con
          estado disponible y parcialmente_vendido. Los lotes vendidos o
          descartados no se muestran en este reporte.
          {user?.rol !== "admin" && (
            <span className="block mt-2">
              Solo puedes ver el inventario de tu unidad.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
