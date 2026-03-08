'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearToken,
  createTask,
  deleteTask,
  getTasks,
  getToken,
  updateTask,
} from '../../lib/api';
import { ConfirmModal } from '../../components/confirm-modal';

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em progresso', label: 'Em progresso' },
  { value: 'concluida', label: 'Concluida' },
];

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  createdAt: string;
  completedAt?: string | null;
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendente');

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    loadTasks(token);
  }, [router, token]);

  async function loadTasks(accessToken: string) {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks(accessToken);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    try {
      await createTask(token, { title, description, status });
      setTitle('');
      setDescription('');
      setStatus('pendente');
      await loadTasks(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa');
    }
  }

  async function handleStatusChange(task: Task, newStatus: string) {
    if (!token) return;

    try {
      await updateTask(token, task.id, { status: newStatus });
      await loadTasks(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa');
    }
  }

  async function handleDelete() {
    if (!token || !deleteTarget) return;

    try {
      await deleteTask(token, deleteTarget.id);
      setDeleteTarget(null);
      await loadTasks(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tarefa');
    }
  }

  function handleLogout() {
    clearToken();
    router.push('/');
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Painel
            </p>
            <h1 className="font-display text-3xl">Minhas tarefas</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Sair
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-xl">Nova tarefa</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Titulo
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: Revisar requisitos"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Descricao
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Detalhes da tarefa"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-sky-600"
              >
                Adicionar tarefa
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Lista</h2>
              <span className="text-sm text-slate-500">
                {tasks.length} tarefas
              </span>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {loading ? (
              <p className="mt-6 text-sm text-slate-500">Carregando...</p>
            ) : tasks.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">
                Nenhuma tarefa criada ainda.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {tasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-ink">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {task.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-slate-400">
                          Criada em {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(task, event.target.value)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500"
                          onClick={() => setDeleteTarget(task)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      <ConfirmModal
        title="Remover tarefa"
        description="Tem certeza que deseja remover esta tarefa?"
        open={!!deleteTarget}
        confirmLabel="Remover"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
