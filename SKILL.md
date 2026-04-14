# PHANTOM GAMING STUDIO / PHOENIX AI
## Developer Skills & Tool Registry — SKILL.md
### Phoenix AI © 2026 | Last updated: 2026-04-13

---

## QUICK REFERENCE — Tool Index

| Tool | Type | Install | Use Case |
|------|------|---------|----------|
| Graphify | Knowledge Graph CLI | `pip install graphifyy` | Map codebase/corpus connections |
| Goose | AI Agent CLI | `gh repo clone aaif-goose/goose` | Local agentic task runner |
| Composio | Tool Router SDK | `pip install composio` | Connect AI agents to 250+ APIs |
| Hermes Agent | Research Agent CLI | install script | Web research + file writing |
| Claude Code | AI IDE | see Anthropic docs | Agentic coding in terminal |

---

## 1. GRAPHIFY

**What it is:** A knowledge graph engine that maps semantic connections between concepts
across your entire codebase, corpus, or document library. Outputs interactive HTML visualisations,
Obsidian vaults, Neo4j graphs, and agent-queryable wikis.

**GitHub:** https://github.com/safishamsi/graphify

### Install
```bash
pip install graphifyy
graphify install

# With video/audio transcription support
pip install 'graphifyy[video]'
```

### Core Commands
```bash
# Run on current directory
graphify ./my-corpus

# Run on specific folder
graphify ./raw

# Build modes
graphify ./raw --mode deep          # aggressive INFERRED edge extraction
graphify ./raw --update             # re-extract only changed files
graphify ./raw --directed           # preserves edge direction source→target
graphify ./raw --cluster-only       # rerun clustering on existing graph only
graphify ./raw --no-viz             # skip HTML, produce report + JSON only
graphify ./raw --watch              # auto-sync as files change

# Output formats
graphify ./raw --obsidian           # generate Obsidian vault
graphify ./raw --obsidian --obsidian-dir ~/vaults/myproject
graphify ./raw --svg                # export graph.svg
graphify ./raw --graphml            # export for Gephi/yEd
graphify ./raw --neo4j              # generate cypher.txt for Neo4j
graphify ./raw --neo4j-push bolt://localhost:7687  # push to live Neo4j
graphify ./raw --mcp                # start MCP stdio server
graphify ./raw --wiki               # build agent-crawlable wiki

# Add content to corpus
graphify add https://arxiv.org/abs/1706.03762        # fetch paper
graphify add https://x.com/karpathy/status/...       # fetch tweet
graphify add <video-url>                              # download + transcribe audio
graphify add https://... --author "Name"
graphify add https://... --contributor "Name"

# Query the graph
graphify query "what connects attention to the optimizer?"
graphify query "show the auth flow" --dfs
graphify query "what is CfgNode?" --budget 500
graphify path "DigestAuth" "Response"
graphify explain "SwinTransformer"
```

### Git Hooks (auto-rebuild on commit)
```bash
graphify hook install
graphify hook uninstall
graphify hook status
```

### AI Assistant Integration
```bash
# Claude Code
graphify claude install         # adds CLAUDE.md + PreToolUse hook
graphify claude uninstall

# Cursor
graphify cursor install         # adds .cursor/rules/graphify.mdc
graphify cursor uninstall

# Gemini CLI
graphify gemini install         # adds GEMINI.md + BeforeTool hook
graphify gemini uninstall

# GitHub Copilot CLI
graphify copilot install

# Aider
graphify aider install

# Other agents
graphify codex install          # AGENTS.md (Codex)
graphify opencode install       # AGENTS.md + tool.execute.before (OpenCode)
graphify claw install           # AGENTS.md (OpenClaw)
graphify droid install          # AGENTS.md (Factory Droid)
graphify trae install           # AGENTS.md (Trae)
graphify antigravity install    # .agent/rules + workflows (Google Antigravity)
```

### When to Use Graphify (in this project)
- Map connections across the Phantom Gaming Studio OS codebase
- Query relationships between app modules ("what connects Auth0 to the Token Economy?")
- Generate a wiki for Phoenix AI developer onboarding
- Keep graph updated as new OS modules ship via `--watch` or git hooks
- Export to Neo4j for the Business OS knowledge graph feature

---

## 2. GOOSE (AI Agent)

**What it is:** An open-source local AI agent CLI — runs tasks, browses the web, writes files,
executes code. Think of it as Claude Code's open-source sibling.

**GitHub:** https://github.com/aaif-goose/goose

### Install
```bash
gh repo clone aaif-goose/goose
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

### When to Use
- Local file manipulation + code execution tasks
- Web research pipelines (pairs well with Hermes Agent below)
- Automating repetitive developer tasks in the Phantom Studio project

---

## 3. HERMES AGENT

**What it is:** A research-focused AI agent CLI that can web search, extract web content,
and write research summaries to disk. Built by NousResearch.

**API Docs:** https://portal.nousresearch.com/api-docs

### Install
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### Example Workflow
```bash
# Hermes researches a topic, saves result to file
❯ Research the latest approaches to GRPO training and write a summary
   web_search "GRPO reinforcement learning 2026"         # 1.2s
   web_extract arxiv.org/abs/2402.03300                  # 3.1s
   web_search "GRPO vs PPO ablation results"             # 0.9s
   web_extract huggingface.co/blog/grpo                  # 2.8s
   write_file ~/research/grpo-summary.md                 # 0.1s
```

### When to Use
- Market research for Phantom Gaming Studio business development
- Competitor analysis for the App Store positioning
- Researching new indie game trends for curation

---

## 4. COMPOSIO SDK

**What it is:** A tool-routing SDK that connects any AI agent to 250+ real-world APIs
(Gmail, GitHub, Slack, Stripe, Notion etc.) via native tools or MCP.

**Platform:** https://platform.composio.dev
**Docs:** https://docs.composio.dev

### Install
```bash
# Python — Anthropic/Claude
pip install composio composio_anthropic anthropic

# Python — OpenAI Agents
pip install composio composio-openai-agents openai-agents

# Python — Claude Agent SDK
pip install composio composio-claude-agent-sdk claude-agent-sdk

# Python — LangChain
pip install composio langchain langchain-openai langchain-mcp-adapters

# Python — Google
pip install composio composio_google google-genai
pip install composio composio_google_adk google-adk

# TypeScript — core
npm install @composio/core @composio/anthropic @anthropic-ai/sdk
npm install @composio/core @composio/openai openai
```

### Core Pattern (ALWAYS use this)
```python
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")
session = composio.create(user_id="user_123")
tools = session.tools()
# pass tools to your LLM framework
```

### MCP Pattern (no provider package needed)
```python
session = composio.create(user_id="user_123")
# use session.mcp.url and session.mcp.headers with any MCP client
```

### Claude + Composio Integration
```python
import json
import anthropic
from composio import Composio
from composio_anthropic import AnthropicProvider

composio = Composio(provider=AnthropicProvider())
client = anthropic.Anthropic()

session = composio.create(user_id="user_123")
tools = session.tools()

messages = [{"role": "user", "content": "Send an email to ..."}]
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=tools,
    messages=messages,
)

while response.stop_reason == "tool_use":
    tool_use_blocks = [b for b in response.content if b.type == "tool_use"]
    results = composio.provider.handle_tool_calls(user_id="user_123", response=response)
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {"type": "tool_result", "tool_use_id": tool_use_blocks[i].id, "content": json.dumps(r)}
            for i, r in enumerate(results)
        ]
    })
    response = client.messages.create(model="claude-sonnet-4-6", max_tokens=4096, tools=tools, messages=messages)
```

### Terminology (v3 current)
| Old (v1/v2) | Current (v3) |
|---|---|
| entity ID | user_id |
| actions | tools |
| apps / appType | toolkits |
| integration / integration ID | auth config / auth_config_id |
| connection | connected account |
| ComposioToolSet / OpenAIToolSet | Composio(provider=...) |
| toolset | provider |

### Composio CLI Quick Reference
```bash
composio login
composio whoami
composio search "create a github issue"
composio execute GITHUB_CREATE_ISSUE -d '{"owner":"...","repo":"...","title":"..."}'
composio link gmail
composio run './workflow.ts'
composio proxy https://gmail.googleapis.com/... --toolkit gmail
```

### When to Use Composio (Phantom Studio)
- Power the Phantom App Store's backend integrations (Stripe, Auth0, GitHub)
- Developer OS — connect to GitHub, Jira, Notion, Slack
- Business OS — connect to CRM, invoicing, calendar
- Marketing OS — connect to social media APIs
- Financial OS — connect to Stripe, bank APIs

---

## 5. COMPOSIO API KEYS & CREDENTIALS

```
COMPOSIO_API_KEY=<stored in .env — never commit>
EXTERNAL_USER_ID=<stored in .env — never commit>
```

> ⚠️  NEVER commit real API keys to public repos. Store in `.env` (gitignored). Ask Valerie for the actual keys.

---

## 6. DOCUMENTATION LINKS

### Composio
- https://docs.composio.dev
- https://docs.composio.dev/docs/providers/openai.md
- https://docs.composio.dev/docs/providers/anthropic.md
- https://docs.composio.dev/docs/providers/claude-agent-sdk.md
- https://docs.composio.dev/docs/providers/google.md
- https://docs.composio.dev/docs/providers/google-adk.md
- https://docs.composio.dev/docs/cli.md
- https://docs.composio.dev/docs/providers/custom-providers/typescript.md
- https://docs.composio.dev/docs/providers/custom-providers/python.md
- https://docs.composio.dev/cookbooks.md

### Graphify
- https://github.com/safishamsi/graphify

### Goose
- https://github.com/aaif-goose/goose

### Hermes Agent
- https://portal.nousresearch.com/api-docs

### Anthropic
- https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk
- https://console.anthropic.com/settings/keys

---

## 7. RECOMMENDED PROJECT SETUP (.env template)

```bash
# .env — DO NOT COMMIT
COMPOSIO_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
STRIPE_SECRET_KEY=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
PHOENIX_AI_ENV=development
```

---

## 8. NOTES FOR CLAUDE CODE

When working on Phantom Gaming Studio code:
1. Always run `graphify ./src --update` after adding new modules to keep the knowledge graph current
2. Use Composio for any external API integrations — don't build raw HTTP clients
3. Auth0 + Stripe are the approved payment/auth stack — do not swap
4. All user-facing AI features should route through the Phoenix AI provider layer
5. Token economy (`⬡ Phantom Tokens`) lives in the Financial OS — treat it as an internal ledger

---

*SKILL.md maintained by Phoenix AI · Phantom Gaming Studio Project · 2026*

---

## 9. CLAW CODE (Ultraworkers Agent Superpower)

**What it is:** Claw Code dramatically expands what Claude Code and all AI agents can do — ultra-context awareness, cross-tool orchestration, agent-to-agent communication, and mega output quality.

**GitHub:** https://github.com/ultraworkers/claw-code
**README:** https://github.com/ultraworkers/claw-code?tab=readme-ov-file#claw-code

### Install
```bash
gh repo clone ultraworkers/claw-code
cd claw-code
claw install --claude       # Wire into Claude Code
claw install --all-agents   # Wire into all agents (Goose, Hermes, etc.)
```

### Add to ALL PhoennixAI Projects
Every new project should run:
```bash
claw install --claude
graphify claude install
```

### Benefits in PhoennixAI Context
- Dramatically better autonomous coding and decision-making
- Agent-to-agent orchestration for complex multi-step workflows
- Ultra file system mastery — finds and fixes issues Claude Code misses
- Superior output quality on all delivery tasks
