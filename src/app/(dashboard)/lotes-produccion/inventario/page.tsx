"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import { useInventarioVariedad } from "@/hooks/use-lotes-produccion";
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
  ArrowLeft,
  TrendingUp,
  Boxes,
  Scale,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InventarioPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSemilla, setFiltroSemilla] = useState<string>("all");
  const [filtroVariedad, setFiltroVariedad] = useState<string>("all");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("all");

  const {
    data: inventario,
    isLoading,
    isError,
    error,
  } = useInventarioVariedad();

  // Obtener opciones únicas para los filtros
  const opcionesSemillas = useMemo(() => {
    if (!inventario) return [];
    const semillas = [...new Set(inventario.map((item) => item.semilla))];
    return semillas.sort();
  }, [inventario]);

  const opcionesVariedades = useMemo(() => {
    if (!inventario) return [];
    let items = inventario;
    // Si hay filtro de semilla, filtrar variedades
    if (filtroSemilla !== "all") {
      items = items.filter((item) => item.semilla === filtroSemilla);
    }
    const variedades = [...new Set(items.map((item) => item.variedad))];
    return variedades.sort();
  }, [inventario, filtroSemilla]);

  const opcionesCategorias = useMemo(() => {
    if (!inventario) return [];
    const categorias = [...new Set(inventario.map((item) => item.categoria))];
    return categorias.sort();
  }, [inventario]);

  // Aplicar filtros
  const inventarioFiltrado = useMemo(() => {
    if (!inventario) return [];

    let resultado = inventario;

    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.variedad.toLowerCase().includes(searchLower) ||
          item.semilla.toLowerCase().includes(searchLower) ||
          item.categoria.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por semilla
    if (filtroSemilla !== "all") {
      resultado = resultado.filter((item) => item.semilla === filtroSemilla);
    }

    // Filtro por variedad
    if (filtroVariedad !== "all") {
      resultado = resultado.filter((item) => item.variedad === filtroVariedad);
    }

    // Filtro por categoría
    if (filtroCategoria !== "all") {
      resultado = resultado.filter(
        (item) => item.categoria === filtroCategoria
      );
    }

    return resultado;
  }, [inventario, searchTerm, filtroSemilla, filtroVariedad, filtroCategoria]);

  // Calcular totales generales
  const totales = useMemo(() => {
    return inventarioFiltrado.reduce(
      (acc, item) => ({
        bolsas: acc.bolsas + Number(item.total_bolsas),
        kg: acc.kg + Number(item.total_kg),
        items: acc.items + 1,
      }),
      { bolsas: 0, kg: 0, items: 0 }
    );
  }, [inventarioFiltrado]);

  // Verificar si hay filtros activos
  const hayFiltrosActivos =
    filtroSemilla !== "all" ||
    filtroVariedad !== "all" ||
    filtroCategoria !== "all" ||
    searchTerm !== "";

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroSemilla("all");
    setFiltroVariedad("all");
    setFiltroCategoria("all");
    setSearchTerm("");
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
        <Button
          variant="ghost"
          onClick={() => router.push("/lotes-produccion")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <Package2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Inventario Consolidado
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Resumen de inventario agrupado por variedad y categoría
        </p>
      </div>

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
            <CardTitle className="text-sm font-medium">Total Bolsas</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totales.bolsas.toLocaleString()}
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
              {totales.kg}
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
            <h3 className="text-lg font-semibold">Filtros</h3>
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
              <Select value={filtroSemilla} onValueChange={setFiltroSemilla}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las semillas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las semillas</SelectItem>
                  {opcionesSemillas.map((semilla) => (
                    <SelectItem key={semilla} value={semilla}>
                      {semilla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Variedad */}
            <div>
              <Select
                value={filtroVariedad}
                onValueChange={setFiltroVariedad}
                disabled={opcionesVariedades.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las variedades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las variedades</SelectItem>
                  {opcionesVariedades.map((variedad) => (
                    <SelectItem key={variedad} value={variedad}>
                      {variedad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Categoría */}
            <div>
              <Select
                value={filtroCategoria}
                onValueChange={setFiltroCategoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {opcionesCategorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Badges de filtros activos */}
          {hayFiltrosActivos && (
            <div className="flex flex-wrap gap-2">
              {filtroSemilla !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Semilla: {filtroSemilla}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFiltroSemilla("all")}
                  />
                </Badge>
              )}
              {filtroVariedad !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Variedad: {filtroVariedad}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFiltroVariedad("all")}
                  />
                </Badge>
              )}
              {filtroCategoria !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Categoría: {filtroCategoria}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFiltroCategoria("all")}
                  />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: "{searchTerm}"
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
                <TableHead className="text-right">Total Bolsas</TableHead>
                <TableHead className="text-right">Total Kg</TableHead>
                <TableHead className="text-right">Kg Promedio/Bolsa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventarioFiltrado && inventarioFiltrado.length > 0 ? (
                inventarioFiltrado.map((item, index) => {
                  const kgPromedio =
                    Number(item.total_kg) / Number(item.total_bolsas);
                  return (
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
                        {Number(item.total_bolsas).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {Number(item.total_kg)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {kgPromedio}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
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
              Mostrando {inventarioFiltrado.length} de {inventario?.length || 0}{" "}
              productos
            </p>
            <div className="text-sm text-muted-foreground">
              Total mostrado:{" "}
              <span className="font-semibold text-foreground">
                {totales.bolsas.toLocaleString()} bolsas
              </span>{" "}
              |{" "}
              <span className="font-semibold text-foreground">
                {totales.kg} kg
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
        </p>
      </div>
    </div>
  );
}
