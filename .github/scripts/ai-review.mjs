import fs from "node:fs/promises";

const OUTPUT_PATH = process.env.AI_REVIEW_OUTPUT_PATH || "ai-review-report.md";
const DIFF_PATH = process.env.PR_DIFF_PATH || "pr.diff";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const API_KEY = process.env.OPENAI_API_KEY;
const MAX_DIFF_CHARS = 20_000;

function formatSkippedReport(reason) {
  return `## AI Review Report (Skipped)

- Status: skipped
- Reason: ${reason}
- Quality gates (`lint`, `unit/integration`, `build`, `e2e-smoke`) remain required.
`;
}

function extractOutputText(responseJson) {
  if (typeof responseJson?.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  if (Array.isArray(responseJson?.output)) {
    const chunks = [];
    for (const item of responseJson.output) {
      if (!Array.isArray(item?.content)) continue;
      for (const content of item.content) {
        if (typeof content?.text === "string") chunks.push(content.text);
      }
    }
    const joined = chunks.join("\n").trim();
    if (joined) return joined;
  }

  return "";
}

async function main() {
  let diffText = "";
  try {
    diffText = await fs.readFile(DIFF_PATH, "utf8");
  } catch {
    const report = formatSkippedReport(`diff file not found: ${DIFF_PATH}`);
    await fs.writeFile(OUTPUT_PATH, report, "utf8");
    return;
  }

  if (!diffText.trim()) {
    const report = formatSkippedReport("empty diff");
    await fs.writeFile(OUTPUT_PATH, report, "utf8");
    return;
  }

  if (!API_KEY) {
    const report = formatSkippedReport("OPENAI_API_KEY is missing");
    await fs.writeFile(OUTPUT_PATH, report, "utf8");
    return;
  }

  const [reviewPrompt, testPrompt, uiPrompt] = await Promise.all([
    fs.readFile(".github/ai-prompts/reviewer.md", "utf8"),
    fs.readFile(".github/ai-prompts/test-suggestions.md", "utf8"),
    fs.readFile(".github/ai-prompts/ui-consistency.md", "utf8"),
  ]);

  const trimmedDiff =
    diffText.length > MAX_DIFF_CHARS
      ? `${diffText.slice(0, MAX_DIFF_CHARS)}\n\n[diff truncated to ${MAX_DIFF_CHARS} chars]`
      : diffText;

  const input = `You are reviewing a pull request for a portfolio-grade jobhunt dashboard.
Return markdown only.

${reviewPrompt}

${testPrompt}

${uiPrompt}

Diff:
\`\`\`diff
${trimmedDiff}
\`\`\`
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      const report = formatSkippedReport(`OpenAI API ${response.status}: ${details.slice(0, 300)}`);
      await fs.writeFile(OUTPUT_PATH, report, "utf8");
      return;
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);

    if (!outputText) {
      const report = formatSkippedReport("empty model output");
      await fs.writeFile(OUTPUT_PATH, report, "utf8");
      return;
    }

    const fullReport = `## AI Review Report

${outputText}
`;

    await fs.writeFile(OUTPUT_PATH, fullReport, "utf8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const report = formatSkippedReport(`request failed: ${message}`);
    await fs.writeFile(OUTPUT_PATH, report, "utf8");
  }
}

await main();
