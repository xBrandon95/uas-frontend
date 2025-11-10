"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { NavUser } from "@/components/nav-user";

// Mapeo de rutas a breadcrumbs
const routeLabels: Record<string, string> = {
  "ordenes-ingreso": "Órdenes de Ingreso",
  "lotes-produccion": "Lotes de Producción",
  "ordenes-salida": "Órdenes de Salida",
  "inventario-consolidado": "Inventario Consolidado",
  usuarios: "Usuarios",
  unidades: "Unidades",
  "gestion-semilla": "Gestión de Semilla",
  semilleras: "Semilleras",
  cooperadores: "Cooperadores",
  conductores: "Conductores",
  vehiculos: "Vehículos",
  clientes: "Clientes",
};

const categoryLabels: Record<string, string> = {
  usuarios: "Administración",
  unidades: "Administración",
  "gestion-semilla": "Administración",
  semilleras: "Administración",
  cooperadores: "Administración",
  conductores: "Administración",
  vehiculos: "Administración",
  clientes: "Administración",
  "ordenes-ingreso": "Operaciones",
  "lotes-produccion": "Operaciones",
  "ordenes-salida": "Operaciones",
  "inventario-consolidado": "Operaciones",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    checkAuth();
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [hasHydrated, isAuthenticated, checkAuth, router]);

  // Mientras carga el persist, no renderices nada
  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Generar breadcrumbs dinámicos
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "inicio";
  const category = categoryLabels[currentPage];
  const pageLabel = routeLabels[currentPage] || currentPage;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {category && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">{category}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Usuario en la parte superior derecha */}
          <div className="pr-4">{user && <NavUser user={user} />}</div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
