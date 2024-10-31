/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { Button } from "@/src/components/ui/button";
import { EnvelopeOpenIcon, ReloadIcon } from "@radix-ui/react-icons"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SignInWithGoogle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function handleSignIn() {
    setLoading(true);

    await signIn("google");
  }

  useEffect(() => {
    if (session?.status === "loading") {
      setLoading(true);
    }

    if (session?.status === "authenticated") {
      router.push("/dicas");
    }

    if (session?.status === "unauthenticated") {
      setLoading(false);
    }
  }, [router, session?.status]);

  return (
    <Button
      variant="default"
      type="button"
      className="w-full font-bold"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
      )}
      Entrar com Google
    </Button>
  );
}
