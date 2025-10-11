"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ usuario, password });
      toast.success("¡Bienvenido!");
      router.push("/unidades");
    } catch (error) {
      console.log(error);
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">SEMILLAS</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Inicia sesión con tu cuenta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="usuario">Usuario</FieldLabel>
          <Input
            id="usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Iniciar sesión
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="underline underline-offset-4">
              Regístrate
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
