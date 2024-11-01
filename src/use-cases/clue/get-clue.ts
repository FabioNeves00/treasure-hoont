import { InferSelectModel } from "drizzle-orm";
import { api } from "../../lib/api";
import { rounds } from "../../server/db/schema";

export const getClue = async () => {
  const response = await api(`/rounds`);
  return response.data as InferSelectModel<typeof rounds> & { nextId: string };
};