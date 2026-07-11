/**
 * Pre-build TL;DR generation (FR-BLOG-6, NFR-OPS-4, ADR-0003/0004).
 * Run `npm run tldr` after writing/editing posts. Generates key takeaways
 * for new/changed posts only (content-hash keyed) and commits the result
 * to content/tldr-cache.json. `next build` never calls AI.
 *
 * Provider-agnostic: uses whichever of OPENROUTER_API_KEY / OPENAI_API_KEY /
 * ANTHROPIC_API_KEY is configured (AI_PROVIDER overrides). Model map per
 * ADR-0004 (TL;DR tier — build-time, so the stronger model).
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { generateText } from "ai";

const POSTS_DIR = "content/posts";
const CACHE_FILE = "content/tldr-cache.json";

// Keep in sync with lib/config.ts detection order and the ADR-0004 model map.
async function resolveModel() {
  const env = process.env;
  const candidates = [
    {
      name: "openrouter",
      key: env.OPENROUTER_API_KEY,
      load: async () => {
        const { createOpenRouter } = await import("@openrouter/ai-sdk-provider");
        return createOpenRouter({ apiKey: env.OPENROUTER_API_KEY })(
          "anthropic/claude-sonnet-4.6",
        );
      },
    },
    {
      name: "openai",
      key: env.OPENAI_API_KEY,
      load: async () => {
        const { createOpenAI } = await import("@ai-sdk/openai");
        return createOpenAI({ apiKey: env.OPENAI_API_KEY })("gpt-5.4");
      },
    },
    {
      name: "anthropic",
      key: env.ANTHROPIC_API_KEY,
      load: async () => {
        const { createAnthropic } = await import("@ai-sdk/anthropic");
        return createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })(
          "claude-sonnet-4-6",
        );
      },
    },
  ];

  const override = env.AI_PROVIDER?.trim().toLowerCase();
  const ordered = override
    ? candidates.filter((c) => c.name === override && c.key)
    : candidates.filter((c) => c.key?.trim());

  if (ordered.length === 0) return null;
  return { name: ordered[0].name, model: await ordered[0].load() };
}

function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}

function stripFrontmatter(raw) {
  return raw.replace(/^---[\s\S]*?---\s*/, "");
}

async function main() {
  const provider = await resolveModel();
  if (!provider) {
    console.log(
      "tldr: no AI provider configured (OPENROUTER_API_KEY / OPENAI_API_KEY / ANTHROPIC_API_KEY) — nothing generated; posts render without TL;DR blocks.",
    );
    return;
  }
  console.log(`tldr: using provider "${provider.name}"`);

  const cache = JSON.parse(await readFile(CACHE_FILE, "utf8").catch(() => "{}"));
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".mdx"));
  let generated = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = await readFile(path.join(POSTS_DIR, file), "utf8");
    const body = stripFrontmatter(raw);
    const bodyHash = hash(body);

    if (cache[slug]?.hash === bodyHash) {
      console.log(`tldr: ${slug} — up to date`);
      continue;
    }

    console.log(`tldr: ${slug} — generating…`);
    const { text } = await generateText({
      model: provider.model,
      maxOutputTokens: 400,
      prompt: [
        "Summarize this blog post as 2-4 key takeaways for a busy engineer.",
        "Rules: each takeaway is one sentence, direct, no hype adjectives,",
        'no preamble. Output ONLY a JSON array of strings, e.g. ["...", "..."].',
        "",
        body,
      ].join("\n"),
    });

    let takeaways;
    try {
      takeaways = JSON.parse(text.trim().replace(/^```(json)?|```$/g, ""));
      if (!Array.isArray(takeaways) || takeaways.some((t) => typeof t !== "string")) {
        throw new Error("not a string array");
      }
    } catch {
      console.warn(`tldr: ${slug} — unparseable output, skipping`);
      continue;
    }

    cache[slug] = { hash: bodyHash, takeaways: takeaways.slice(0, 4) };
    generated += 1;
  }

  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`);
  console.log(`tldr: done — ${generated} generated, cache written to ${CACHE_FILE}`);
}

main().catch((error) => {
  console.error(`tldr: failed — ${error.message}`);
  process.exitCode = 1;
});
