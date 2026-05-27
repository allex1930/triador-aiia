# Triador - Desafio Técnico aiia

Aplicação web para análise de aderência entre currículo e vaga, desenvolvida para o desafio técnico de Desenvolvedor Fullstack Júnior.

O sistema recebe o texto de um currículo e de uma vaga, executa uma análise estruturada com apoio de LLM, valida o resultado, salva a análise em banco relacional e exibe o histórico na interface.

## Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- OpenAI API

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS

## Estrutura

```txt
triador-aiia/
├── backend/
└── frontend/
```

No backend, o projeto foi separado em camadas:

```txt
app/main.py                              -> rotas HTTP
app/services/analysis_service.py         -> regra de análise e integração com LLM
app/repositories/analysis_repository.py  -> persistência no banco
app/models.py                            -> modelo da tabela
app/schemas.py                           -> validação dos dados
app/database.py                          -> conexão com SQLite
```

## Funcionalidades

- Criar análise entre currículo e vaga
- Retornar nome do candidato, habilidades técnicas, anos de experiência, nota de aderência e resumo
- Persistir cada análise no banco SQLite
- Consultar histórico de análises
- Interface com campos de entrada, loading, resultado e histórico

## Integração com IA

A integração com LLM foi feita usando a OpenAI API.

O backend solicita uma resposta em JSON estruturado e valida o retorno usando o schema `AnalysisResult`.

Caso o provedor retorne erro, JSON inválido, campos ausentes ou problema de cota/API, a aplicação utiliza um fallback controlado para evitar quebra da requisição.

Durante o desenvolvimento, a API retornou erro de cota (`insufficient_quota`), então o fallback foi mantido para garantir que o fluxo ponta a ponta continue funcionando.

## Variáveis de ambiente

Na pasta `backend`, crie um arquivo `.env` com base no `.env.example`:

```env
OPENAI_API_KEY=sua_chave_aqui
```

O arquivo `.env` não deve ser versionado.

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative o ambiente virtual:

```bash
py -m venv venv
source venv/Scripts/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Rode a API:

```bash
uvicorn app.main:app --reload
```

A API ficará disponível em:

```txt
http://127.0.0.1:8000
```

A documentação da API estará em:

```txt
http://127.0.0.1:8000/docs
```

## Como rodar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

A interface ficará disponível em:

```txt
http://localhost:3000
```

## Endpoints

### GET /

Verifica se a API está rodando.

### POST /analyses

Cria uma nova análise.

Exemplo de body:

```json
{
  "resume_text": "Texto do currículo",
  "job_text": "Texto da vaga"
}
```

### GET /analyses

Lista o histórico de análises salvas.

## Decisões técnicas

Escolhi Python com FastAPI pela simplicidade, produtividade e boa integração com APIs de IA.

Usei SQLite por ser suficiente para o escopo do desafio e facilitar a execução local sem configuração de banco externo.

As habilidades técnicas foram armazenadas como texto para manter o modelo simples. Em uma evolução futura, poderiam ser normalizadas em uma tabela própria.

A lógica de análise ficou isolada na camada de service, e a persistência ficou separada na camada de repository.

## Próximos passos

- Adicionar testes para validar o formato da resposta da IA
- Melhorar o tratamento de erros e tentativas na chamada do provedor LLM
- Evoluir a modelagem das habilidades técnicas, se necessário