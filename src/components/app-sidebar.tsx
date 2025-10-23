"use client";

import * as React from "react";
import { ShieldUser, Sprout, NotepadText, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
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
        icon: Users,
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
        title: "Lotes produccion",
        url: "/lotes-produccion",
        roles: ["admin", "encargado", "operador"],
      },
      {
        title: "Ordenes salida",
        url: "/ordenes-salida",
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
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Sprout className="size-5" />
          </div>
          SEMILLAS
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>

      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
