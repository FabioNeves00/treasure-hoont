import { InferSelectModel } from "drizzle-orm";
import { api } from "../../lib/api";
import { routes } from "../../server/db/schema";

export const getRoute = async (id: string) => {
  const response = await api(`/routes/${id}`);
  return response.data as InferSelectModel<typeof routes>;
};