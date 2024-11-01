import { InferSelectModel } from "drizzle-orm";
import { api } from "../../lib/api";
import { routes } from "../../server/db/schema";

export const getRoutes = async () => {
  const response = await api.get("/api/routes");
  return response.data as InferSelectModel<typeof routes>[];
};