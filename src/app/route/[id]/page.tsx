"use client";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "../../../components/ui/use-toast";
import { getClueById } from "../../../use-cases/clue/get-clue-by-id";
import { answer } from "../../../use-cases/user/answer";

export default function Page() {
  const [clue, setClue] = useState<{
    hint: string;
    id: string;
    nextId: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const { id } = useParams();
  const session = useSession();

  // if (!session.data?.user) {
  //   redirect("/login");
  // }

  useEffect(() => {
    const loadClue = async () => {
      try {
        const data = await getClueById(id as string);
        setClue({ hint: data.hint!, id: data.id, nextId: data.nextId });
        setStatus("success");
      } catch {
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadClue();
  }, [id]);

  const loadTeacherHint = async () => {
    setLoading(true);
    const data = await getClueById(clue!.nextId);
    setClue({ hint: data.hint!, id: data.id, nextId: "" });
    setLoading(false);
    setStatus(null);
  };

  const handleClick = async () => {
    setLoading(true);
    const { newAnswer, err } = await answer(inputRef.current!.value.trim(), clue!.id);
    setLoading(false);

    if (err) {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Erro ao responder",
        description:
          "Houve um erro ao responder. Tente novamente mais tarde ou encontre o responsável.",
      });
      return;
    }

    if (newAnswer) {
      setStatus("success");
      toast({
        title: newAnswer.isRight
          ? "Resposta Correta!"
          : "Resposta incorreta :(",
        description: newAnswer.isRight
          ? "Sua resposta foi correta. Procure a próxima dica com o professor!"
          : "Resposta incorreta, tente novamente!",
      });

      if (newAnswer.isRight) {
        setClue({ hint: "Procure o professor!", id: "1", nextId: "1" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 transition-all duration-200">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        <div className="space-y-2 text-lg md:text-xl">
          <p>{clue?.hint}</p>
        </div>

        <div className="flex justify-center mt-24 gap-10 items-center w-full">
          <input
            ref={inputRef}
            id="answer"
            name="answer"
            type="text"
            placeholder="Insira sua resposta..."
            required
            className="mt-1 block max-w-lg appearance-none rounded-md border border-gray-300 px-5 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          {status === "success" ? (
            <Button
              variant="default"
              disabled={loading}
              onClick={handleClick}
              className="hover:shadow-lg"
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          ) : (
            <Button
              variant="link"
              disabled={loading}
              onClick={loadTeacherHint}
              className="hover:shadow-lg flex w-fit"
            >
              {/*@ts-expect-error - null check later */}
              {status === "success" ? <Check className="h-4 w-4" /> : null}{" "}
              Próxima dica...
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
