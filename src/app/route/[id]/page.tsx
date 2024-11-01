"use client";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Link from "next/link";
import { toast } from "../../../components/ui/use-toast";
import { getClueById } from "../../../use-cases/clue/get-clue-by-id";
import { answer } from "../../../use-cases/user/answer";

export default function Page() {
  const [clue, setClue] = useState<{ hint: string; id: string, nextId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    //@ts-expect-error - null check later
      getClueById(id).then((data) => {
        setClue({
          hint: data.hint!,
          id: data.id,
          nextId: data.nextId
        });
        setLoading((prev) => false);
        setSuccess((prev) => true);
      });
  }, []);

  const loadTeacherHint = async () => {
    setLoading((prev) => true);
    const { hint, id } = await getClueById(clue!.nextId);
    setLoading((prev) => false);
    setClue({
      hint: hint!,
      id,
      nextId: ""
    });
    
    setSuccess((prev) => false);
  };

  const handleClick = async () => {
    setLoading((prev) => true);
    const { newAnswer, err } = await answer(inputRef.current!.value, clue!.id);
    if (err) {
      setError((prev) => true);
      setLoading((prev) => false);
      toast({
        variant: "destructive",
        title: "Erro ao responder",
        description:
          "Houve um erro ao responder. Por favor, tente novamente mais tarde ou encontre o responsável local.",
      });
    } else if (newAnswer) {
      setSuccess((prev) => true);
      setLoading((prev) => false);
      toast({
        title: "Resposta enviada com sucesso",
        description:
          "Sua resposta foi enviada com sucesso. Agora você pode procurar a proxima dica com o professor!",
      });
      if (newAnswer.isRight) {
        setClue({ hint: "Procure o professor!", id: "1", nextId: "1" });
        setSuccess((prev) => true);
        toast({
          title: "Resposta Correta!!!!",
          description:
            "Sua resposta foi correta. Agora você pode procurar a proxima dica com o professor!",
        });
      } else {
        toast({
          title: "Resposta incorreta :(",
          description:
            "Sua resposta foi incorreta, tente novamente!",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 transition-all duration-200">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        {/* Welcome text content */}
        <div className="space-y-2 text-lg md:text-xl">
          <p>{clue?.hint}</p>
        </div>

        {/* Action button */}
        <div className="flex justify-center gap-5 items-center w-full">
          <input
            ref={inputRef}
            id="answer"
            name="answer"
            type="email"
            placeholder="Insira sua resposta..."
            required
            className="mt-1 block max-w-lg appearance-none rounded-md border border-gray-300 px-5 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          {success ? (
            <Button
              variant={error ? "destructive" : "default"}
              disabled={loading}
              className="hover:shadow-lg"
              onClick={handleClick}
            >
              {/* {(loading) ?? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {!loading ?? <ArrowBigRight className="mr-2 h-4 w-4"/>}
            {success ? <Check className="mr-2 h-4 w-4"/> : null} */}
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          ) : (
            <Button
              variant="link"
              disabled={loading}
              onClick={loadTeacherHint}
              className="hover:shadow-lg flex w-fit justify-center flex-row"
            >
                {success ? <Check className="h-4 w-4" /> : null}
                Proxima dica...
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
