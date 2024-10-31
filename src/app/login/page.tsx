import Link from 'next/link';
import { Form } from '@/src/components/ui/form';
import { SignInWithCredential } from './sign-in-with-credentials';
import { SignInWithGoogle } from './sign-in-with-google';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Login</h3>
          <p className="text-sm text-gray-500">
            Utilize seu email do cesupa para fazer login
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              redirectTo: '/protected',
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            });
          }}
        >
          <SignInWithCredential />
          <div className="flex items-center justify-center w-full gap-4">
            <div className="h-[1px] bg-slate-400 flex-1" />
            <span className="text-md text-slate-500">Ou</span>
            <div className="h-[1px] bg-slate-400 flex-1" />
          </div>
          <SignInWithGoogle />
          <p className="text-center text-sm text-gray-600">
            {"Não possui uma conta? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Registre-se
            </Link>
            {' de graça.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
