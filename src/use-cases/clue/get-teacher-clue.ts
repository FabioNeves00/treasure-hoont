import { api } from "../../lib/api";

export const getTeacherClue = async (id: string) => {
  const response = await api(`/clues/teacher-clue`);
  return response.data;
};