// src/hooks/useQuickCreateDialogsOrdenSalida.tsx
import { useState } from "react";

export function useQuickCreateDialogsOrdenSalida() {
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false);
  const [conductorDialogOpen, setConductorDialogOpen] = useState(false);
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);

  const [onClienteCreated, setOnClienteCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onConductorCreated, setOnConductorCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onVehiculoCreated, setOnVehiculoCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  return {
    dialogs: {
      cliente: {
        open: clienteDialogOpen,
        setOpen: setClienteDialogOpen,
        onCreated: onClienteCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnClienteCreated({ callback: cb }),
      },
      conductor: {
        open: conductorDialogOpen,
        setOpen: setConductorDialogOpen,
        onCreated: onConductorCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnConductorCreated({ callback: cb }),
      },
      vehiculo: {
        open: vehiculoDialogOpen,
        setOpen: setVehiculoDialogOpen,
        onCreated: onVehiculoCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnVehiculoCreated({ callback: cb }),
      },
    },
  };
}