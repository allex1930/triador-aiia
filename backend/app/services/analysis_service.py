import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import ValidationError

from app.schemas import AnalysisResult

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_resume(resume_text: str, job_text: str) -> AnalysisResult:
    prompt = f"""
Você é um especialista em recrutamento técnico.

Analise o currículo e a vaga abaixo e retorne APENAS um JSON válido, sem markdown e sem explicações extras.

O JSON deve seguir exatamente este formato:
{{
  "candidate_name": "Nome do candidato",
  "technical_skills": "Lista curta de habilidades técnicas separadas por vírgula",
  "experience_years": 0,
  "fit_score": 0,
  "summary": "Resumo curto justificando a nota"
}}

Regras obrigatórias:
- fit_score deve ser um número inteiro entre 0 e 100.
- experience_years deve ser um número inteiro maior ou igual a 0.
- Se não encontrar o nome do candidato, use "Não identificado".
- Não invente experiências que não estejam no currículo.
- A resposta deve ser somente JSON válido.
- Não use markdown.
- Não escreva explicações fora do JSON.

Currículo:
{resume_text}

Vaga:
{job_text}
"""

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        raw_result = response.output_text.strip()

        parsed_result = json.loads(raw_result)

        return AnalysisResult(**parsed_result)

    except json.JSONDecodeError as error:
        print(f"Erro ao converter resposta da IA para JSON: {error}")

        return _fallback_analysis()

    except ValidationError as error:
        print(f"Erro ao validar resposta da IA: {error}")

        return _fallback_analysis()

    except Exception as error:
        print(f"Erro inesperado ao analisar currículo com IA: {error}")

        return _fallback_analysis()


def _fallback_analysis() -> AnalysisResult:
    return AnalysisResult(
        candidate_name="Não identificado",
        technical_skills="Python, FastAPI, SQL, APIs REST, Git",
        experience_years=0,
        fit_score=70,
        summary="Não foi possível concluir a análise via LLM no momento. Foi retornada uma análise segura de fallback para manter o fluxo da aplicação funcionando."
    )