import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestor de Tarefas',
  description: 'Aplicacao de tarefas com autenticacao JWT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
