# search-ai-agent
A simple CLI based AI agent powered by the Anthropic API with built-in web search.

## Prereqs
- Node.js 18+
- Anthropic API key

## Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/pallavkant/my-first-agent.git
   cd my-first-agent
   npm install
   ```
2. Copy the example env file and add your own API key: NOTE: The agent will not work without a valid API key.
   ```bash
   cp agent.env.example agent.env
   ```
   Edit `agent.env` and set `ANTHROPIC_API_KEY` to your key.

## Run
```bash
npm start
```
Type your questions at the `You:` prompt. Press **Ctrl+C** to quit.

## License
MIT
