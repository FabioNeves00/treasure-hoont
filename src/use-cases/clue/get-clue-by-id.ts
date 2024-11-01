import { InferSelectModel } from "drizzle-orm";
import { api } from "../../lib/api";
import { rounds } from "../../server/db/schema";

export const getClueById = async (id: string) => {
  const response = await api(`/rounds/${id}`);
  return response.data as InferSelectModel<typeof rounds>;
};