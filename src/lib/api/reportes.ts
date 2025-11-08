import api from "@/lib/axios";

export async function descargarReporteOrdenIngreso(id: number): Promise<void> {
  const response = await api.get(`/reportes/orden-ingreso/${id}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `orden-ingreso-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function descargarReporteOrdenSalida(id: number): Promise<void> {
  const response = await api.get(`/reportes/orden-salida/${id}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `orden-salida-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

interface FiltrosInventario {
  idUnidad?: number;
  idSemilla?: number;
  idVariedad?: number;
  idCategoria?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export async function descargarReporteInventarioConsolidado(
  filtros: FiltrosInventario
): Promise<void> {
  const params = new URLSearchParams();

  if (filtros.idUnidad) params.append("idUnidad", filtros.idUnidad.toString());
  if (filtros.idSemilla)
    params.append("idSemilla", filtros.idSemilla.toString());
  if (filtros.idVariedad)
    params.append("idVariedad", filtros.idVariedad.toString());
  if (filtros.idCategoria)
    params.append("idCategoria", filtros.idCategoria.toString());
  if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
  if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

  const response = await api.get(
    `/reportes/inventario-consolidado?${params.toString()}`,
    {
      responseType: "blob",
    }
  );

  const timestamp = new Date().toISOString().split("T")[0];
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `inventario-consolidado-${timestamp}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
