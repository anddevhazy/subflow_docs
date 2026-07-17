import { createHighlighter, type Highlighter } from "shiki";

const THEME = "dark-plus";

const LANGS = ["json", "javascript", "typescript", "bash", "python", "text"] as const;

const langMap: Record<string, string> = {
  bash: "bash",
  shell: "bash",
  curl: "bash",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  json: "json",
  text: "text",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

export function resolveLanguage(language: string): string {
  return langMap[language.toLowerCase()] ?? "text";
}

export async function highlightCode(code: string, language: string): Promise<string> {
  const highlighter = await getHighlighter();
  const lang = resolveLanguage(language);

  try {
    return highlighter.codeToHtml(code.trimEnd(), { lang, theme: THEME });
  } catch {
    return highlighter.codeToHtml(code.trimEnd(), { lang: "text", theme: THEME });
  }
}
