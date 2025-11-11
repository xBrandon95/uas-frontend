"use client";

import * as React from "react";
import { ShieldUser, Sprout, NotepadText } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";

const navData = [
  {
    title: "Administración",
    url: "#",
    icon: ShieldUser,
    isActive: true,
    items: [
      {
        title: "Usuarios",
        url: "/usuarios",
        roles: ["admin"],
      },
      {
        title: "Unidades",
        url: "/unidades",
        roles: ["admin"],
      },
      {
        title: "Gestión semilla",
        url: "/gestion-semilla",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Semilleras",
        url: "/semilleras",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Cooperadores",
        url: "/cooperadores",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Conductores",
        url: "/conductores",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Vehiculos",
        url: "/vehiculos",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Clientes",
        url: "/clientes",
      },
    ],
  },
  {
    title: "Operaciones",
    url: "#",
    icon: NotepadText,
    isActive: true,
    items: [
      {
        title: "Ordenes ingreso",
        url: "/ordenes-ingreso",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Ordenes salida",
        url: "/ordenes-salida",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Inventario Consolidado",
        url: "/inventario-consolidado",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Movimiento lotes",
        url: "/lotes-produccion",
        roles: ["admin", "encargado", "operador"],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const userRole = user?.rol ?? "";

  const filteredNav = navData
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(userRole)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Sprout className="size-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">SEMILLAS</span>

              {user?.rol === "admin" ? (
                <span className="text-xs text-sidebar-foreground/60">
                  Administrador
                </span>
              ) : (
                user?.nombre_unidad && (
                  <span className="text-xs text-sidebar-foreground/70">
                    {user.nombre_unidad}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1.5 text-xs text-sidebar-foreground/50">
          v1.0.0
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
