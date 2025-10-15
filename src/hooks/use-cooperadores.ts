import {
  getCooperadores,
  createCooperador,
  updateCooperador,
  deleteCooperador,
  getCooperadorById,
  getCooperadoresActivos,
} from "@/lib/api/cooperadores";
import {
  CreateCooperadorDto,
  PaginationFilterParams,
  UpdateCooperadorDto,
} from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCooperadores(params: PaginationFilterParams) {
  return useQuery({
    queryKey: ["cooperadores", params],
    queryFn: () => getCooperadores(params),
  });
}

export function useCooperador(id: number | null) {
  return useQuery({
    queryKey: ["cooperador", id],
    queryFn: () => getCooperadorById(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCooperadoresActivos() {
  return useQuery({
    queryKey: ["cooperadores-activos"],
    queryFn: () => getCooperadoresActivos(),
    staleTime: 60000,
  });
}

export function useCreateCooperador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCooperadorDto) => createCooperador(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperadores"] });
      queryClient.invalidateQueries({ queryKey: ["cooperadores-activos"] });
      toast.success("Cooperador creado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateCooperador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCooperadorDto }) =>
      updateCooperador(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperadores"] });
      queryClient.invalidateQueries({ queryKey: ["cooperadores-activos"] });
      toast.success("Cooperador actualizado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteCooperador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCooperador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperadores"] });
      queryClient.invalidateQueries({ queryKey: ["cooperadores-activos"] });
      toast.success("Cooperador eliminado exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
