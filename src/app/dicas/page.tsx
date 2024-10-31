'use client';
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  const session = useSession();
  if (!session.data?.user) return <div>Carregando...</div>;
  const avatar = session.data.user.image!;
  const splittedName = session.data.user.name!.split(" ");
  const [firstName, lastName] = [splittedName[0], splittedName.at(-1)];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 transition-all duration-200">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        {/* Circle avatar */}
        <Image src={avatar} alt="Avatar" width={128} height={128} className="rounded-full mb-4" />

        {/* Welcome text content */}
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-medium">
            Bem vindo, <span className="font-bold">{firstName + " " + lastName}</span>
          </h1>
          <div className="space-y-2 text-lg md:text-xl">
            <p>Busque os detentores de conhecimento</p>
            <p>Eles são o caminho</p>
            <p className="font-mono">Sua trilha é !@#!@^#!@#&)!@#@/*</p>
          </div>
        </div>

        {/* Action button */}
        <Button className="hover:opacity-80">
          Descubra sua trilha
        </Button>
      </div>
    </div>
  )
}
