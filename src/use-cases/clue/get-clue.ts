import { api } from "../../lib/api";

export const getClue = async (id: string) => {
  const response = await api(`/rounds`);
  return response.data;
};