// src/components/ordenes-ingreso/hooks/useQuickCreateDialogs.ts
import { useState } from "react";

export function useQuickCreateDialogs() {
  const [semilleraDialogOpen, setSemilleraDialogOpen] = useState(false);
  const [cooperadorDialogOpen, setCooperadorDialogOpen] = useState(false);
  const [conductorDialogOpen, setConductorDialogOpen] = useState(false);
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);
  const [semillaDialogOpen, setSemillaDialogOpen] = useState(false);
  const [variedadDialogOpen, setVariedadDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);

  return {
    dialogs: {
      semillera: {
        open: semilleraDialogOpen,
        setOpen: setSemilleraDialogOpen,
      },
      cooperador: {
        open: cooperadorDialogOpen,
        setOpen: setCooperadorDialogOpen,
      },
      conductor: {
        open: conductorDialogOpen,
        setOpen: setConductorDialogOpen,
      },
      vehiculo: {
        open: vehiculoDialogOpen,
        setOpen: setVehiculoDialogOpen,
      },
      semilla: {
        open: semillaDialogOpen,
        setOpen: setSemillaDialogOpen,
      },
      variedad: {
        open: variedadDialogOpen,
        setOpen: setVariedadDialogOpen,
      },
      categoria: {
        open: categoriaDialogOpen,
        setOpen: setCategoriaDialogOpen,
      },
    },
  };
}
