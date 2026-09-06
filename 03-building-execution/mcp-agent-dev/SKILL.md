---
name: mcp-agent-dev
description: แนวทางการพัฒนาและใช้งาน Model Context Protocol (MCP) servers, AI agent skills, และ agentic workflows ใช้เมื่อสร้าง MCP server, เขียน agent skills, หรือ integrate AI agents เข้ากับระบบ
---

# MCP & AI Agent Development Skill

แนวทางการสร้างและใช้งาน Model Context Protocol (MCP) servers, agent skills, และ AI agent development

---

## 1. ความเข้าใจพื้นฐาน

### MCP คืออะไร?
**Model Context Protocol (MCP)** คือ protocol มาตรฐานเปิด (เหมือน "USB-C สำหรับ AI") ที่เชื่อมต่อ AI agents กับ external data sources และ tools

```
┌─────────────┐    MCP Protocol    ┌─────────────┐
│   AI Agent   │ ◄──────────────► │  MCP Server  │
│   (Host)     │   JSON-RPC 2.0   │   (Tools)    │
└─────────────┘                    └─────────────┘
```

### Agent Skills คืออะไร?
**Agent Skills** คือชุดคำสั่ง (instruction sets) ในไฟล์ `SKILL.md` ที่บอก AI agent ว่าต้องทำงานอย่างไร — เปรียบเหมือน "คู่มือปฏิบัติงาน" ที่ agent อ่านเพื่อทำงานตาม pattern ที่กำหนด

| Component | บทบาท | ตัวอย่าง |
|---|---|---|
| **MCP Server** | ให้ความสามารถ (tools/data) | Database query, API calls, File system |
| **Agent Skill** | ให้คำแนะนำ (how-to) | Coding standards, deployment workflow |

---

## 2. การสร้าง MCP Server

### โครงสร้างพื้นฐาน (TypeScript)

```typescript
// mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// สร้าง MCP Server instance
const server = new McpServer({
  name: "my-custom-server",
  version: "1.0.0",
});

// ลงทะเบียน Tool — ให้ agent เรียกใช้ได้
server.tool(
  "search_database",
  "ค้นหาข้อมูลในฐานข้อมูล",
  {
    query: z.string().describe("คำค้นหา"),
    limit: z.number().optional().default(10).describe("จำนวนผลลัพธ์สูงสุด"),
  },
  async ({ query, limit }) => {
    // ทำงานจริงตรงนี้
    const results = await db.search(query, limit);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// ลงทะเบียน Resource — ให้ agent อ่านข้อมูลได้
server.resource(
  "config://app",
  "config://app",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(appConfig),
      },
    ],
  })
);

// ลงทะเบียน Prompt — template สำเร็จรูป
server.prompt(
  "code_review",
  "รีวิวโค้ดตามมาตรฐานโปรเจกต์",
  { code: z.string() },
  ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `กรุณารีวิวโค้ดนี้ตามมาตรฐานโปรเจกต์:\n\n${code}`,
        },
      },
    ],
  })
);

// เริ่มต้น server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Setup & Dependencies

```bash
# สร้างโปรเจกต์ MCP Server
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node

# tsconfig.json
npx tsc --init --target ES2022 --module NodeNext --moduleResolution NodeNext --outDir ./dist
```

### package.json สำหรับ MCP Server

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-mcp-server": "./dist/mcp-server.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/mcp-server.js"
  }
}
```

---

## 3. การ Config MCP Server สำหรับ Agent ต่างๆ

### Antigravity IDE / VS Code

สร้างไฟล์ `.agents/mcp.json` ใน root ของโปรเจกต์:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./dist/mcp-server.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src"]
    }
  }
}
```

### Claude Desktop

แก้ไขไฟล์ `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/dist/mcp-server.js"]
    }
  }
}
```

### Cursor

สร้างไฟล์ `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./dist/mcp-server.js"]
    }
  }
}
```

---

## 4. การสร้าง Agent Skills

### โครงสร้าง SKILL.md

```markdown
---
name: skill-name-here
description: คำอธิบายสั้นๆ ว่า skill นี้ใช้ทำอะไร ตอนไหน
---

# ชื่อ Skill

## เมื่อไหร่ควรใช้
อธิบายว่า skill นี้ควรถูก trigger เมื่อไหร่

## ขั้นตอนการทำงาน
1. ขั้นตอนที่ 1
2. ขั้นตอนที่ 2

## กฎที่ต้องปฏิบัติ
- DO: สิ่งที่ต้องทำ
- DO NOT: สิ่งที่ห้ามทำ

## ตัวอย่างโค้ด
...code examples...
```

### วางไว้ที่ไหน?

```
# Global (ใช้ทุกโปรเจกต์)
~/.gemini/config/skills/<skill-name>/SKILL.md

# Per-project
.agents/skills/<skill-name>/SKILL.md
```

---

## 5. MCP Server ยอดนิยม (พร้อมใช้งาน)

| Server | ใช้ทำอะไร | ติดตั้ง |
|---|---|---|
| **Filesystem** | อ่าน/เขียนไฟล์ | `npx @modelcontextprotocol/server-filesystem` |
| **GitHub** | จัดการ repos, issues, PRs | `npx @modelcontextprotocol/server-github` |
| **PostgreSQL** | Query ฐานข้อมูล | `npx @modelcontextprotocol/server-postgres` |
| **Brave Search** | ค้นหาเว็บ | `npx @modelcontextprotocol/server-brave-search` |
| **Memory** | จำข้อมูลระหว่าง sessions | `npx @modelcontextprotocol/server-memory` |
| **Puppeteer** | ควบคุมเบราว์เซอร์ | `npx @modelcontextprotocol/server-puppeteer` |
| **Sequential Thinking** | วิเคราะห์ปัญหาซับซ้อน | `npx @modelcontextprotocol/server-sequential-thinking` |

---

## 6. Security Best Practices

### MANDATORY Rules

1. **ห้ามใส่ API keys ใน config โดยตรง** — ใช้ environment variables เสมอ
2. **ใช้เฉพาะ MCP servers ที่เชื่อถือได้** — เพราะมันรันด้วย permissions ของ user
3. **จำกัด scope** — ให้ MCP server เข้าถึงเฉพาะ data ที่จำเป็น
4. **ตรวจสอบ input** — validate ทุก input ที่เข้ามาผ่าน tools ด้วย Zod schema

```typescript
// ✅ DO: ใช้ environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error("API_KEY is required");

// ❌ DO NOT: hardcode secrets
const apiKey = "sk-1234567890abcdef"; // อันตราย!
```

---

## 7. Debugging & Testing

```bash
# ทดสอบ MCP server ด้วย MCP Inspector
npx @modelcontextprotocol/inspector node dist/mcp-server.js

# ดู logs
# Antigravity IDE: ดูใน Output panel > MCP Servers
# Claude Desktop: ~/Library/Logs/Claude/mcp*.log (macOS)
```

---

## 8. Agentic Workflow Patterns

### Pattern: Chain of Tools

```
User Request → Agent → MCP Tool 1 → Process → MCP Tool 2 → Response
```

### Pattern: Human-in-the-Loop

```
Agent → Propose Action → User Approval → Execute via MCP → Report Results
```

### Pattern: Multi-Agent Orchestration

```
Main Agent → Sub-Agent 1 (via MCP) → Result
           → Sub-Agent 2 (via MCP) → Result
           → Synthesize All Results → Final Response
```
