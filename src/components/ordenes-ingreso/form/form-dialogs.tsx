import { SemilleraFormDialog } from "@/components/semilleras/semillera-form-dialog";
import { CooperadorFormDialog } from "@/components/cooperadores/cooperador-form-dialog";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";
import { SemillaFormDialog } from "@/components/semillas/semilla-form-dialog";
import { VariedadFormDialog } from "@/components/variedades/variedad-form-dialog";
import { CategoriaFormDialog } from "@/components/categorias/categoria-form-dialog";

interface FormDialogsProps {
  dialogs: {
    semillera: { open: boolean; setOpen: (open: boolean) => void };
    cooperador: { open: boolean; setOpen: (open: boolean) => void };
    conductor: { open: boolean; setOpen: (open: boolean) => void };
    vehiculo: { open: boolean; setOpen: (open: boolean) => void };
    semilla: { open: boolean; setOpen: (open: boolean) => void };
    variedad: { open: boolean; setOpen: (open: boolean) => void };
    categoria: { open: boolean; setOpen: (open: boolean) => void };
  };
}

export function FormDialogs({ dialogs }: FormDialogsProps) {
  return (
    <>
      <SemilleraFormDialog
        open={dialogs.semillera.open}
        onOpenChange={dialogs.semillera.setOpen}
      />

      <CooperadorFormDialog
        open={dialogs.cooperador.open}
        onOpenChange={dialogs.cooperador.setOpen}
      />

      <ConductorFormDialog
        open={dialogs.conductor.open}
        onOpenChange={dialogs.conductor.setOpen}
      />

      <VehiculoFormDialog
        open={dialogs.vehiculo.open}
        onOpenChange={dialogs.vehiculo.setOpen}
      />

      <SemillaFormDialog
        open={dialogs.semilla.open}
        onOpenChange={dialogs.semilla.setOpen}
      />

      <VariedadFormDialog
        open={dialogs.variedad.open}
        onOpenChange={dialogs.variedad.setOpen}
      />

      <CategoriaFormDialog
        open={dialogs.categoria.open}
        onOpenChange={dialogs.categoria.setOpen}
      />
    </>
  );
}
