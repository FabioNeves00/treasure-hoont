'use client';
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "../../lib/api";
import { useState } from "react";
import { assignRoute } from "../../use-cases/user/assign-route";

export default function Page() {
  const [route, setRoute] = useState<{title: string}>({ title: "!@!%$!#&%!!" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const session = useSession();
  if (!session.data?.user) return <div>Carregando...</div>;
  const avatar = session.data.user.image!;
  const splittedName = session.data.user.name!.split(" ");
  const [firstName, lastName] = [splittedName[0], splittedName.at(-1)];
  //on click reverse animation from span and change content
  const handleClick = async () => {
    setLoading(prev => true)
    const response = await assignRoute();
    if (response.error) {
      setError(prev => true);
      setLoading(prev => false)
    } else if (response.message){
      setRoute(response.route);
      setLoading(prev => false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 transition-all duration-200">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        {/* Circle avatar */}
        <Image src={avatar} alt="Avatar" width={128} height={128} className="rounded-full mb-4 shadow-md shadow-black" />

        {/* Welcome text content */}
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-medium">
            Bem vindo, <span className="font-bold">{firstName + " " + lastName}</span>
          </h1>
          <div className="space-y-2 text-lg md:text-xl">
            <p>Busque os detentores de conhecimento</p>
            <p>Eles são o caminho</p>
            <p className="font-mono ">Sua trilha é {" "}
              <span data-attribute="revealer" className="relative w-max font-mono
              before:absolute before:inset-0 before:animate-typewriter
              before:bg-white
              after:absolute after:inset-0 after:w-[0.125em] after:ml-[0.25em] after:animate-caret
              after:bg-black">
                { route.title }
              </span>
            </p>
          </div>
        </div>

        {/* Action button */}
        <Button variant={error ? "destructive" : "default"} disabled={error || loading} className="hover:shadow-lg" onClick={handleClick}>
          Descubra sua trilha
        </Button>
      </div>
    </div>
  )
}
