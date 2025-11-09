// src/components/ordenes-salida/form/FormDialogsOrdenSalida.tsx
import { ClienteFormDialog } from "@/components/clientes/cliente-form-dialog";
import { ConductorFormDialog } from "@/components/conductores/conductor-form-dialog";
import { VehiculoFormDialog } from "@/components/vehiculos/vehiculo-form-dialog";

interface FormDialogsOrdenSalidaProps {
  dialogs: {
    cliente: {
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
  };
}

export function FormDialogsOrdenSalida({
  dialogs,
}: FormDialogsOrdenSalidaProps) {
  return (
    <>
      <ClienteFormDialog
        open={dialogs.cliente.open}
        onOpenChange={dialogs.cliente.setOpen}
        onCreated={dialogs.cliente.onCreated}
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
    </>
  );
}
