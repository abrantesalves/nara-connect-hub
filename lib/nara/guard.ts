export interface GuardResult {
  valid: boolean;
  sanitized: string;
  reason?: string;
}

const MAX_LENGTH = 4000;

const FORBIDDEN_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
];

export function guardUserInput(input: string): GuardResult {
  if (!input || typeof input !== "string") {
    return { valid: false, sanitized: "", reason: "Entrada vazia ou inválida." };
  }

  let sanitized = input.trim();

  if (sanitized.length === 0) {
    return { valid: false, sanitized: "", reason: "Mensagem vazia." };
  }

  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.slice(0, MAX_LENGTH);
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(sanitized)) {
      return { valid: false, sanitized: "", reason: "Conteúdo não permitido detectado." };
    }
  }

  return { valid: true, sanitized };
}

export function guardApiResponse(text: string): string {
  if (!text || typeof text !== "string") {
    return "Desculpe, não consegui processar a resposta.";
  }
  return text.slice(0, 8000);
}
