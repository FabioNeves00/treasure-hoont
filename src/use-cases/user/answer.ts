import { api } from "../../lib/api";

export const answer = async (content: string) => {
  const response = await api("/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      content,
    }
  });
  
  return response.data;
} 