'use client';
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { getUserRoute } from "../../use-cases/user/get-route";
import { titleCase } from "../../lib/title-case";
import { getClue } from "../../use-cases/clue/get-clue";

export default function Page() {
  const [route, setRoute] = useState<{title: string, id: string}>({ title: "!@!%$!#&%!!", id: " "});
  const [isTeacherClue, setIsTeacherClue] = useState<boolean>(false);
  const [clue, setClue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const session = useSession();

  useEffect(() => {
    getUserRoute().then(data => {
      if (data.error) {
        setError(prev => true);
        setLoading(prev => false)
      } else if (data.id) {
        setRoute(data);
        setLoading(prev => false)
        setSuccess(prev => true);
      }
    });

    // getClue().then(data => {
    //   if (data.error) {
    //     setError(prev => true);
    //     setLoading(prev => false)
    //   } else if (data.id) {
    //     setClue(data);
    //     setLoading(prev => false)
    //     setSuccess(prev => true);
    //   }
    // });
  }, [])

  if (!session.data?.user) {
    redirect("/login");
  };

  const splittedName = session.data!.user.name!.split(" ");
  const [firstName, lastName] = [splittedName[0], splittedName.at(-1)];

  const handleClick = async () => {
    setLoading(prev => true)
    
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 transition-all duration-200">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        {/* Welcome text content */}
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-medium">
            Bem vindo, <span className="font-bold">{titleCase(firstName + " " + lastName)} de {route.title}</span>
          </h1>
          <div className="space-y-2 text-lg md:text-xl">
            <p>{}</p>
            
          </div>
        </div>

        {/* Action button */}
          <input
          ref={inputRef}
          id="answer"
          name="answer"
          type="email"
          placeholder="Insira sua resposta..."
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
          <Button variant={error ? "destructive" : "default"} disabled={loading} className="hover:shadow-lg" onClick={handleClick}>
            Enviar
          </Button>
      </div>
    </div>
  )
}
