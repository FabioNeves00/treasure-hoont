'use client';
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { assignRoute } from "../../use-cases/user/assign-route";
import { redirect } from "next/navigation";
import { getUserRoute } from "../../use-cases/user/get-route";
import { toast } from "../../components/ui/use-toast";
import Link from "next/link";
import { titleCase } from "../../lib/title-case";

export default function Page() {
  const [route, setRoute] = useState<{title: string, id: string}>({ title: "!@!%$!#&%!!", id: " "});
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
  }, []);

  if (!session.data?.user) {
    redirect("/login");
  };

  const avatar = session.data!.user.image!;
  const splittedName = session.data!.user.name!.split(" ");
  const [firstName, lastName] = [splittedName[0], splittedName.at(-1)];

  const handleClick = async () => {
    setLoading(prev => true)
    const { error, message, route } = await assignRoute();

    if (error) {
      setError(prev => true);
      setLoading(prev => false)
      toast({
        variant: "destructive",
        title: "Erro ao atribuir sua trilha",
        description: "Houve um erro ao atribuir sua trilha. Por favor, tente novamente mais tarde ou encontre o responsável local.",
      });
    } else if (message){
      setRoute(route);
      setLoading(prev => false)
      toast({
        title: "Trilha atribuída com sucesso",
        description: "Sua trilha foi atribuída com sucesso. Agora você pode começar a jogar!",
      });
      setSuccess(prev => true);
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
            Bem vindo, <span className="font-bold">{titleCase(firstName + " " + lastName)}</span>
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
                { route?.title || "#!@%#&!ˆ#&%$!*)!" }
              </span>
            </p>
          </div>
        </div>

        {/* Action button */}
        {
          success ?
            <Link href={`/route`}>  
            <Button variant="link" disabled={loading} className="hover:shadow-lg">Proxima dica...</Button></Link>
           : <Button variant={error ? "destructive" : "default"} disabled={loading} className="hover:shadow-lg" onClick={handleClick}>
            Descubra sua trilha
          </Button>
        }
      </div>
    </div>
  )
}
