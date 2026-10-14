# For AI agents

This repository is a skill library. Do not treat it as an application to build or run.

- **User asks to pull / install all skills from this repo** → follow the section "🤖 คำสั่งสำหรับ AI Agent: ดึงสกิลทั้งหมด" in [README.md](README.md). Short version, run at the root of the user's project:

  ```bash
  npx skills add Foam-01/Global-Skills --skill "*" -a claude-code -y   # Antigravity: -a antigravity
  ```

  Expect 29 skill folders. Keep `LICENSE` / `NOTICE.md` files. Ask before overwriting skills that did not come from this repo. Tell the user to start a new session afterwards.
- **User names specific skills** → install only those: `npx skills add Foam-01/Global-Skills --skill <name> --skill <name> -a claude-code -y`
- Never copy `docs/`, `evals/` or the root `README.md` into the user's project.
