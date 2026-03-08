'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, saveToken, getToken } from '../lib/api';

export default function HomePage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push('/tasks');
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isRegister
        ? await registerUser({ name, email, password })
        : await loginUser({ email, password });

      saveToken(response.accessToken);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-xl shadow-slate-200/40">
        <div className="grid gap-8 p-5 md:p-10 md:grid-cols-[1.1fr_1fr]">
          <section className="flex flex-col justify-center text-center gap-6">
            <span className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-primary md:text-left">
              Gestor de Tarefas
            </span>
            <h1 className="font-display text-4xl text-ink md:text-5xl">
              Organize tarefas com foco e simplicidade.
            </h1>
            <p className="text-base text-slate-600">
              Acesse, acompanhe e conclua suas tarefas com status claros e
              um fluxo rapido de registro e login.
            </p>
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-600">
                Tecnologias
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-white px-3 py-1">Next.js</span>
                <span className="rounded-full bg-white px-3 py-1">NestJS</span>
                <span className="rounded-full bg-white px-3 py-1">JWT</span>
                <span className="rounded-full bg-white px-3 py-1">TypeORM</span>
                <span className="rounded-full bg-white px-3 py-1">PostgreSQL</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">
                {isRegister ? 'Criar conta' : 'Entrar'}
              </h2>
              <button
                type="button"
                className="text-sm font-semibold text-primary"
                onClick={() => setIsRegister((prev) => !prev)}
              >
                {isRegister ? 'Ja tenho conta' : 'Quero me registrar'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">
                    Nome
                  </label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimo 6 caracteres"
                  required
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-70"
              >
                {loading ? 'Processando...' : isRegister ? 'Registrar' : 'Entrar'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
