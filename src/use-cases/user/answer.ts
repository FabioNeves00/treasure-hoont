import { Infer } from "next/dist/compiled/superstruct";
import { api } from "../../lib/api";
import { InferSelectModel } from "drizzle-orm";
import { answers } from "../../server/db/schema";

export const answer = async (answer: string, roundId: string) => {
  const response = await api("/answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      answer,
      roundId
    }
  });

  return response.data as AnswerResponse;
} 

type AnswerResponse = ({
      err: string;
      status: number;
    } & {
      newAnswer?: never;
    })
  | ({
      newAnswer: InferSelectModel<typeof answers>;
    } & {
      err?: never;
      status?: never;
    });