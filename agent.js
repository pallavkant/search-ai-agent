import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import * as readline from "readline";

dotenv.config({ path: "agent.env" });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const conversationHistory = [];

function extractText(content) {
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

async function runAgent(messages) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "You are a helpful AI agent. Use web_search when you need current info.",
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages,
  });

  for (const block of response.content) {
    if (block.type === "server_tool_use" && block.name === "web_search") {
      console.log(`🔧 Searching: "${block.input.query}"`);
    }
  }

  return extractText(response.content) || "(no response)";
}

async function chat(userText) {
  conversationHistory.push({ role: "user", content: userText });
  const answer = await runAgent(conversationHistory);
  conversationHistory.push({ role: "assistant", content: answer });
  return answer;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask() {
  if (rl.closed) return;
  rl.question("\nYou: ", async (input) => {
    if (!input.trim()) return ask();
    try {
      const answer = await chat(input.trim());
      console.log(`\nAgent: ${answer}`);
    } catch (err) {
      console.error("\nError:", err.message ?? err);
    }
    ask();
  });
}

rl.on("close", () => process.exit(0));

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Add it to agent.env and try again.");
  process.exit(1);
}

console.log("Agent ready. Type your question (Ctrl+C to quit).\n");
ask();
