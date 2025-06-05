import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { camerasService } from "@/services";
import { CameraListParams, CameraUpdatePayload } from "@/types";

export const CAMERAS_QUERY_KEY = "cameras";
export const CAMERA_QUERY_KEY = "camera";

export function useCameras(params?: CameraListParams) {
  return useQuery({
    queryKey: [CAMERAS_QUERY_KEY, params],
    queryFn: () => camerasService.getCameras(params),
  });
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: [CAMERA_QUERY_KEY, id],
    queryFn: () => camerasService.getCameraById(id),
    enabled: !!id,
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CameraUpdatePayload }) =>
      camerasService.updateCamera(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAMERAS_QUERY_KEY] });
      queryClient.setQueryData([CAMERA_QUERY_KEY, data.id], data);
    },
  });
}
