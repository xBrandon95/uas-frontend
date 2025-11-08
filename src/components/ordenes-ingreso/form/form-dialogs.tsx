// src/components/ordenes-ingreso/form/form-dialogs.tsx
import { SemilleraFormDialog } from "@/components/semilleras/semillera-form-dialog";
import { CooperadorFormDialog } from "@/components/cooperadores/cooperador-form-dialog";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";
import { SemillaFormDialog } from "@/components/semillas/semilla-form-dialog";
import { VariedadFormDialog } from "@/components/variedades/variedad-form-dialog";
import { CategoriaFormDialog } from "@/components/categorias/categoria-form-dialog";

interface FormDialogsProps {
  dialogs: {
    semillera: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    cooperador: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    conductor: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    vehiculo: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    semilla: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    variedad: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
    categoria: {
      open: boolean;
      setOpen: (open: boolean) => void;
      onCreated: ((id: number) => void) | null;
    };
  };
}

export function FormDialogs({ dialogs }: FormDialogsProps) {
  return (
    <>
      <SemilleraFormDialog
        open={dialogs.semillera.open}
        onOpenChange={dialogs.semillera.setOpen}
        onCreated={dialogs.semillera.onCreated}
      />

      <CooperadorFormDialog
        open={dialogs.cooperador.open}
        onOpenChange={dialogs.cooperador.setOpen}
        onCreated={dialogs.cooperador.onCreated}
      />

      <ConductorFormDialog
        open={dialogs.conductor.open}
        onOpenChange={dialogs.conductor.setOpen}
        onCreated={dialogs.conductor.onCreated}
      />

      <VehiculoFormDialog
        open={dialogs.vehiculo.open}
        onOpenChange={dialogs.vehiculo.setOpen}
        onCreated={dialogs.vehiculo.onCreated}
      />

      <SemillaFormDialog
        open={dialogs.semilla.open}
        onOpenChange={dialogs.semilla.setOpen}
        onCreated={dialogs.semilla.onCreated}
      />

      <VariedadFormDialog
        open={dialogs.variedad.open}
        onOpenChange={dialogs.variedad.setOpen}
        onCreated={dialogs.variedad.onCreated}
      />

      <CategoriaFormDialog
        open={dialogs.categoria.open}
        onOpenChange={dialogs.categoria.setOpen}
        onCreated={dialogs.categoria.onCreated}
      />
    </>
  );
}
