"use client";

import { useCallback, useEffect, useState } from "react";

type Analysis = {
  id: number;
  candidate_name: string;
  technical_skills: string;
  experience_years: number;
  fit_score: number;
  summary: string;
  created_at: string;
};

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/analyses`);

      if (!response.ok) {
        throw new Error("Erro ao carregar histórico.");
      }

      const data = await response.json();
      setHistory(data);
    } catch {
      setError("Não foi possível carregar o histórico.");
    }
  }, []);

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (resumeText.length < 10 || jobText.length < 10) {
      setError("Preencha o currículo e a vaga com pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_text: jobText,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao realizar análise.");
      }

      const data = await response.json();

      setResult(data);
      await loadHistory();
    } catch {
      setError(
        "Não foi possível concluir a análise. Verifique se o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadHistory]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            aiia labs challenge
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Triador</h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Ferramenta simples para analisar a aderência entre um currículo e
            uma vaga, com backend em FastAPI, persistência em SQLite e
            integração com LLM.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <label className="mb-2 block font-semibold">
              Texto do currículo
            </label>

            <textarea
              className="h-64 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none focus:border-blue-500"
              placeholder="Cole aqui o texto do currículo..."
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <label className="mb-2 block font-semibold">Texto da vaga</label>

            <textarea
              className="h-64 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none focus:border-blue-500"
              placeholder="Cole aqui o texto da vaga..."
              value={jobText}
              onChange={(event) => setJobText(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {loading ? "Analisando..." : "Analisar aderência"}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {result && (
          <section className="mt-8 rounded-2xl border border-blue-800 bg-blue-950/40 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Resultado da análise</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">Candidato</p>
                <p className="font-semibold">{result.candidate_name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Nota de aderência</p>
                <p className="text-2xl font-bold text-blue-300">
                  {result.fit_score}/100
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Experiência aproximada
                </p>
                <p className="font-semibold">
                  {result.experience_years} ano(s)
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Habilidades técnicas</p>
                <p className="font-semibold">{result.technical_skills}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-400">Resumo</p>
              <p className="mt-1 text-slate-200">{result.summary}</p>
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Histórico de análises</h2>

          {history.length === 0 ? (
            <p className="text-slate-400">Nenhuma análise realizada ainda.</p>
          ) : (
            <div className="grid gap-4">
              {history.map((analysis) => (
                <article
                  key={analysis.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <h3 className="font-bold">{analysis.candidate_name}</h3>

                      <p className="text-sm text-slate-400">
                        {new Date(analysis.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-semibold text-blue-300">
                      {analysis.fit_score}/100
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">
                    <strong>Skills:</strong> {analysis.technical_skills}
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {analysis.summary}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}