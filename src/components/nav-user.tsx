"use client";

import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";

const roleLabels = {
  admin: "Administrador",
  encargado: "Encargado",
  operador: "Operador",
};

const roleVariants = {
  admin: "admin",
  encargado: "encargado",
  operador: "operador",
} as const;

export function NavUser({ user }: { user: User }) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto px-3 py-2"
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.nombre
              )}&background=205284&color=fff`}
              alt={user.nombre}
            />
            <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
              {user.nombre.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start text-left text-sm">
            <span className="font-medium">{user.nombre}</span>
            <span className="text-xs text-muted-foreground">
              {user.usuario}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" side="bottom">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.nombre
                  )}&background=205284&color=fff`}
                  alt={user.nombre}
                />
                <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
                  {user.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.nombre}</span>
                <span className="text-xs text-muted-foreground">
                  @{user.usuario}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={roleVariants[user.rol]} className="text-xs">
                {roleLabels[user.rol]}
              </Badge>

              {user.rol !== "admin" && user?.nombre_unidad && (
                <span className="text-xs text-muted-foreground">
                  {user.nombre_unidad}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
