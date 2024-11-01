import { api } from "../../lib/api";

export const assignRoute = async () => {
  const response = await api(`/api/assign-route`, {
    method: "POST",
  });
  return response.data as RouteResponse;
};

type RouteResponse =
  | ({
      message: "Rota atribuída com sucesso";
      route: {
        id: string;
        title: string;
      };
    } & {
      error?: never;
      status?: never;
    })
  | ({
      error: string;
      status: number;
    } & {
      message?: never;
      route?: never;
    });
