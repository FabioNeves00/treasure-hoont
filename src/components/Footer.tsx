/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f0ebf8]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4 sm:py-12 lg:px-8">
        <div
          className="flex justify-center space-x-12"
          aria-label="Footer"
        >
          <div className="gap-2 text-center">
            <p className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Iniciativa da{" "}
              <span className="text-[hsl(32,98%,52%)]">Parajás</span>
            </p>

            <a href="https://mawatech.com.br" target="_blank" rel="noreferrer">
              <h2 className="text-sm font-extrabold tracking-tight text-gray-900">
                Grupo{" "}
                <span className="text-[hsl(280,100%,70%)]">Mawa Tech</span>
              </h2>
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; 2023 Gaia Parajás - Todos os direitos reservados.
        </p>
        <Link href="https://parajas.com.br">
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            Feito com ♥ por Parajás.
          </p>
        </Link>
      </div>
    </footer>
  );
}
