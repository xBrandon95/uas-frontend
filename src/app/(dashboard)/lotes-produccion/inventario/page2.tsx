"use client";

import { useState } from "react";
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
  Package2,
  Search,
  ArrowLeft,
  TrendingUp,
  Boxes,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventarioPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: inventario,
    isLoading,
    isError,
    error,
  } = useInventarioVariedad();

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        message={error.message}
        title="Error al cargar el inventario"
      />
    );

  // Filtrar inventario por búsqueda
  const inventarioFiltrado = inventario?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.variedad.toLowerCase().includes(searchLower) ||
      item.semilla.toLowerCase().includes(searchLower) ||
      item.categoria.toLowerCase().includes(searchLower)
    );
  });

  // Calcular totales generales
  const totales = inventarioFiltrado?.reduce(
    (acc, item) => ({
      bolsas: acc.bolsas + Number(item.total_unidades),
      kg: acc.kg + Number(item.total_kg),
      items: acc.items + 1,
    }),
    { bolsas: 0, kg: 0, items: 0 }
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
              {totales?.items || 0}
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
              {totales?.bolsas.toLocaleString() || 0}
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
              {totales?.kg.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Peso total disponible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-card rounded-lg border p-6">
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por semilla, variedad, categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

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
                    Number(item.total_kg) / Number(item.total_unidades);
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
                        {Number(item.total_unidades).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {Number(item.total_kg).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {kgPromedio.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm
                      ? `No se encontraron resultados para "${searchTerm}"`
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
                {totales?.bolsas.toLocaleString()} bolsas
              </span>{" "}
              |{" "}
              <span className="font-semibold text-foreground">
                {totales?.kg.toFixed(2)} kg
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
