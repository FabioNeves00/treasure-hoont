import { api } from "../../lib/api";

export const getUserRoute = async () => {
  const response = await api(`/users/get-route`);
  return response.data as RouteResponse;
};

type RouteResponse =
  | ({
        id: string;
        title: string;
    } & {
      error?: never;
      status?: never;
    })
  | ({
      error: string;
      status: number;
    } & {
      id?: never;
        title?: never;
    });