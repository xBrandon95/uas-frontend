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
