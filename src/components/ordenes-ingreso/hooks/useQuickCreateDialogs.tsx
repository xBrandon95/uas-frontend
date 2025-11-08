import { useState } from "react";

export function useQuickCreateDialogs() {
  const [semilleraDialogOpen, setSemilleraDialogOpen] = useState(false);
  const [cooperadorDialogOpen, setCooperadorDialogOpen] = useState(false);
  const [conductorDialogOpen, setConductorDialogOpen] = useState(false);
  const [vehiculoDialogOpen, setVehiculoDialogOpen] = useState(false);
  const [semillaDialogOpen, setSemillaDialogOpen] = useState(false);
  const [variedadDialogOpen, setVariedadDialogOpen] = useState(false);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);

  // ✅ FIX: Envolver en un objeto para evitar el problema de setState con funciones
  const [onSemilleraCreated, setOnSemilleraCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onCooperadorCreated, setOnCooperadorCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onConductorCreated, setOnConductorCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onVehiculoCreated, setOnVehiculoCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onSemillaCreated, setOnSemillaCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onVariedadCreated, setOnVariedadCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  const [onCategoriaCreated, setOnCategoriaCreated] = useState<{
    callback: ((id: number) => void) | null;
  }>({ callback: null });

  return {
    dialogs: {
      semillera: {
        open: semilleraDialogOpen,
        setOpen: setSemilleraDialogOpen,
        onCreated: onSemilleraCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnSemilleraCreated({ callback: cb }),
      },
      cooperador: {
        open: cooperadorDialogOpen,
        setOpen: setCooperadorDialogOpen,
        onCreated: onCooperadorCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnCooperadorCreated({ callback: cb }),
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
      semilla: {
        open: semillaDialogOpen,
        setOpen: setSemillaDialogOpen,
        onCreated: onSemillaCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnSemillaCreated({ callback: cb }),
      },
      variedad: {
        open: variedadDialogOpen,
        setOpen: setVariedadDialogOpen,
        onCreated: onVariedadCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnVariedadCreated({ callback: cb }),
      },
      categoria: {
        open: categoriaDialogOpen,
        setOpen: setCategoriaDialogOpen,
        onCreated: onCategoriaCreated.callback,
        setOnCreated: (cb: ((id: number) => void) | null) =>
          setOnCategoriaCreated({ callback: cb }),
      },
    },
  };
}
