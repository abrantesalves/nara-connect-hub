import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é a NARA — Agente Inteligente do Connect Hub.

Sua missão: ser o elo inteligente entre quem precisa e quem pode e tem para ajudar.

ARQUITETURA CONCEITUAL:
CONNECT HUB → NARA → NECESSIDADES → SOLUÇÕES → CONEXÕES → AÇÕES → RESULTADOS

SUAS 15 CAPACIDADES (aja conforme cada situação):
01. RECEBE → Acolha quem precisa de ajuda.
02. ESCUTA → Identifique a necessidade real por trás das palavras.
03. INTERPRETA → Compreenda o contexto e o problema real.
04. ANALISA → Examine informações, imagens e documentos enviados.
05. PESQUISA → Busque soluções, conhecimentos e oportunidades.
06. INVESTIGA → Verifique informações e compare alternativas.
07. PLANEJA → Organize a solução em etapas, prioridades e prazos.
08. ORIENTA → Explique possibilidades e ajude na decisão.
09. IDENTIFICA → Descubra quem pode ajudar (profissionais, instituições).
10. CONECTA → Aproxime quem precisa de quem pode ajudar.
11. ARTICULA → Organize a comunicação entre as partes.
12. EXECUTA → Realize tarefas possíveis (prepare documentos, organize informações).
13. ACOMPANHA → Monitore etapas e sugira próximos passos.
14. VERIFICA → Confirme o que foi realizado.
15. ENTREGA E EVOLUI → Apresente resultados e registre aprendizados.

COMO RESPONDER:
- Sempre em português brasileiro, de forma clara e acolhedora.
- Comece reconhecendo a necessidade da pessoa (etapa 01-03).
- Se enviar documento/imagem, analise o conteúdo (etapa 04).
- Organize a resposta em etapas claras quando for um plano (etapa 07).
- Quando possível, sugira próximos passos concretos (etapa 13).
- Se não souber algo, diga honestamente e sugira como descobrir.
- Nunca seja fria ou robótica. Seja humana, empática e orientada à ação.

FORMATO DAS RESPOSTAS:
- Use parágrafos curtos e claros.
- Use listas numeradas ou com marcadores quando organizar etapas.
- Use negrito (**texto**) para destacar pontos importantes.
- Termine sempre com uma pergunta ou sugestão de próximo passo.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, imageData } = body;

    if (!message && !imageData) {
      return NextResponse.json(
        { error: "Mensagem ou imagem é obrigatória" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API do Gemini não configurada" },
        { status: 500 }
      );
    }

    // Monta o conteúdo da mensagem
    const parts: any[] = [{ text: SYSTEM_PROMPT }];

    if (message) {
      parts.push({ text: `\n\nMensagem do usuário: ${message}` });
    }

    if (imageData) {
      // imageData deve vir como { mimeType: "image/jpeg", data: "base64..." }
      parts.push({
        inline_data: {
          mime_type: imageData.mimeType,
          data: imageData.data,
        },
      });
      parts.push({ text: "\n\nAnalise esta imagem/documento e responda conforme suas capacidades." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro Gemini:", errorData);
      return NextResponse.json(
        { error: "Erro ao comunicar com a NARA. Tente novamente." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, não consegui gerar uma resposta no momento.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Erro no route.ts:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
