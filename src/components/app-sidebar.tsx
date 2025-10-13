"use client";

import * as React from "react";
import { ShieldUser, Sprout } from "lucide-react";

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
