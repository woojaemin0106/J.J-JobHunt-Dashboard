import fs from "node:fs/promises";

const OUTPUT_PATH = process.env.AI_REVIEW_OUTPUT_PATH || "ai-review-report.md";
const DIFF_PATH = process.env.PR_DIFF_PATH || "pr.diff";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const API_KEY = process.env.OPENAI_API_KEY;
const MAX_DIFF_CHARS = 20_000;
const PROMPT_DIR = ".github/ai-prompts";
const PROMPT_FILES = {
  reviewer: `${PROMPT_DIR}/reviewer.md`,
  tests: `${PROMPT_DIR}/test-suggestions.md`,
  ui: `${PROMPT_DIR}/ui-consistency.md`,
};

function formatSkippedReport(reason) {
  return `## AI Review Report (Skipped)

- Status: skipped
- Reason: ${reason}
- Quality gates (\`lint\`, \`unit/integration\`, \`build\`, \`e2e-smoke\`) remain required.
`;
}

async function writeSkippedReport(reason) {
  await fs.writeFile(OUTPUT_PATH, formatSkippedReport(reason), "utf8");
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

function summarizeDiff(diffText) {
  const fileSet = new Set();
  for (const line of diffText.split("\n")) {
    if (!line.startsWith("diff --git ")) continue;
    const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (!match) continue;
    fileSet.add(match[2]);
  }

  const files = [...fileSet];
  return {
    files,
    preview: files.slice(0, 20).map((file) => `- ${file}`).join("\n"),
  };
}

async function readPrompt(path) {
  const text = await fs.readFile(path, "utf8");
  return text.trim();
}

function buildPromptInput({ prompts, trimmedDiff, fileSummary }) {
  return `You are a senior code reviewer for a portfolio-grade web app pull request.
Return markdown only.

Output requirements:
- Keep total output concise and practical (target <= 450 words).
- Use these exact section headers in order:
  1) ## Change Summary
  2) ## Top Risks
  3) ## Missing Tests
  4) ## UI Consistency Checklist
  5) ## Suggested Next Actions
- In "Top Risks", include severity labels: High/Medium/Low.
- If there are no concrete findings, say "No critical findings".
- Avoid speculation not grounded in the diff.

Prompt pack (versioned in repository):

[Reviewer Prompt]
${prompts.reviewer}

[Test Suggestions Prompt]
${prompts.tests}

[UI Consistency Prompt]
${prompts.ui}

Changed files (${fileSummary.files.length}):
${fileSummary.preview || "- none"}

Diff:
\`\`\`diff
${trimmedDiff}
\`\`\`
`;
}

function formatSuccessReport({ outputText, fileSummary }) {
  return `## AI Review Report

- Status: completed
- Model: \`${MODEL}\`
- Diff source: \`${DIFF_PATH}\`
- Files in diff: ${fileSummary.files.length}

${outputText}
`;
}

async function main() {
  let diffText = "";

  try {
    diffText = await fs.readFile(DIFF_PATH, "utf8");
  } catch {
    await writeSkippedReport(`diff file not found: ${DIFF_PATH}`);
    return;
  }

  if (!diffText.trim()) {
    await writeSkippedReport("empty diff");
    return;
  }

  if (!API_KEY) {
    await writeSkippedReport("OPENAI_API_KEY is missing");
    return;
  }

  let prompts;
  try {
    const [reviewer, tests, ui] = await Promise.all([
      readPrompt(PROMPT_FILES.reviewer),
      readPrompt(PROMPT_FILES.tests),
      readPrompt(PROMPT_FILES.ui),
    ]);
    prompts = { reviewer, tests, ui };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeSkippedReport(`failed to load prompt files: ${message}`);
    return;
  }

  const fileSummary = summarizeDiff(diffText);
  const trimmedDiff =
    diffText.length > MAX_DIFF_CHARS
      ? `${diffText.slice(0, MAX_DIFF_CHARS)}\n\n[diff truncated to ${MAX_DIFF_CHARS} chars]`
      : diffText;

  const input = buildPromptInput({
    prompts,
    trimmedDiff,
    fileSummary,
  });

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
      await writeSkippedReport(`OpenAI API ${response.status}: ${details.slice(0, 300)}`);
      return;
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);
    if (!outputText) {
      await writeSkippedReport("empty model output");
      return;
    }

    await fs.writeFile(
      OUTPUT_PATH,
      formatSuccessReport({ outputText, fileSummary }),
      "utf8"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeSkippedReport(`request failed: ${message}`);
  }
}

await main();
