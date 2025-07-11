# CLAUDE.md

**🚀 Project Title: Study Ninja**

**One-line Summary**: A practice exam platform for children preparing to enter elementary school, focusing on progress tracking and interactive quizzes.

---

## 🎯 Purpose & Scope

- **Why**: Provide a gamified exam practice environment to help children prepare for elementary school entrance exams.
- **Who**:

  - **Users**: Students (kids) practicing quizzes and parents monitoring progress.
  - **Admins**: Educational content creators managing exam questions.

- **How**:

  - **User Journey**: Users log in, take timed exams, view results & progress charts, and compare with peers.
  - **Admin Journey**: Admins log in to create and manage exam content (text/image questions, multiple-choice answers).

---

## 📚 MVP1 Features

### User Features

- Login via email/password.
- Login via SSO (Google, Facebook).
- Take practice exams and receive instant results.
- Record and visualize historical performance with progress charts.
- Compare performance metrics with peer averages.

### Admin Features

- Admin login via basic username/password.
- Create, edit, and delete exam content:

  - Questions can include text or images.
  - Answers support multiple-choice options.

---

## 🏗️ Architecture & Tech Stack & Tech Stack

- **Monorepo**: All services and packages live in a single repository for consistent versioning and shared configuration.
- **Dockerized Codebase**: Every service (frontend, backend, jobs) runs in Docker containers to ensure parity across environments.
- **CI/CD**: GitHub Actions workflows build, test, and deploy via Docker to DigitalOcean.

  - **Build**: Lint, test, and build artifacts in isolated containers.
  - **Deploy**: Push images to DigitalOcean Container Registry and deploy to Droplets or Kubernetes.

- **Database**: Use managed DB providers (Postgres, MongoDB, Redis) based on use case—configured via environment variables.
- **Dependencies**: Pin stable, battle-tested versions—avoid experimental releases.
- **Simplicity & Readability**: Prioritize clear, explicit code over abstractions; avoid over‑engineering.

---

## 👥 Roles & Responsibilities

| Role                           | Responsibility                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Claude (AI Principal Engineer) | Decomposes requirements into **simple**, **secure** designs and outputs structured JSON tasks.         |
| Genmini CLI                    | Consumes JSON tasks to scaffold boilerplate code, configurations, and basic unit tests.                |
| Human Developer (Senior Eng)   | Reviews tasks, implements complex logic, resolves ambiguities, and completes security implementations. |

---

## 🧠 Design Principles

1. **Simplicity First**
   Favor clear, minimal solutions over complex designs.
2. **Security by Design**

   - Enforce authentication, input validation, and least‑privilege access.
   - Highlight security uncertainties for human review.

3. **Verifiable Output**

   - Claude outputs **only** valid JSON (no commentary or markdown).
   - Validate against a predefined JSON Schema before code generation.

4. **Human-in-the-Loop**

   - If Claude is uncertain, **pause** and **ask** for clarification rather than guessing.

---

## 🔄 Workflow Overview

1. **Context Initialization**

   - Principal Engineer crafts a system prompt with goals, tech stack, security policies, and constraints.

2. **Task Decomposition (Claude)**

   - Prompt: "Generate a JSON array of tasks matching the schema—no extra fields or commentary."
   - Example output:

     ```json
     {
       "tasks": [
         {
           "id": 1,
           "file": "models/User.js",
           "desc": "Define User model with id, name, email",
           "framework": "Express + Sequelize"
         }
       ]
     }
     ```

3. **GitHub Issue & Branch Creation**

   - For each task, use GitHub CLI to:

     ```bash
     gh issue create --title "Task #<id>: <desc>" --body "Auto-generated task by Claude" --label "task"
     gh issue view <issue_number> --json number -q .number  # Capture ticket number
     git checkout -b "task/<ticket_number>/<slugified-desc>" main
     ```

   - This enforces a thunk-based branch strategy: one branch per task.

4. **Schema Validation**

   - Use a JSON Schema validator to block malformed or incomplete outputs.
   - On validation failure, iterate with Claude.

5. **Test Case Drafting (Claude)**

   - Claude drafts unit and integration test cases per task, outputting test definitions (e.g., Jest code stubs).

6. **Code Implementation (Genmini CLI)**

   ```bash
   genmini create --input tasks.json --tests tests.json --output ./src
   ```

   - Generates code stubs and test scaffolding on the feature branch.

7. **TDD Loop & Validation (Claude)**

   - Run tests: if all pass, proceed. If tests fail, attempt automated fixes up to **3 iterations**.
   - If still failing, **halt** and **ask** for human guidance.

8. **Committing & PR Creation**

   - Commit changes for each logical change tied to the ticket:

     ```bash
     git add .
     git commit -m "<ticket_number>: Implement <short-desc>"
     ```

   - Push branch and open a PR:

     ```bash
     git push origin HEAD
     gh pr create --title "<ticket_number> Implement <short-desc>" --body "Auto-generated by Genmini" --base main
     ```

9. **Merge & Cleanup**

   - Once approved, merge with squad-commit merge strategy:

     ```bash
     gh pr merge --squash --delete-branch
     ```

10. **Review & Finalize**

    - Senior Engineer verifies merge, ensures security checks, and closes related issue if not auto-closed.

---

## 📐 Task JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "file": { "type": "string" },
          "desc": { "type": "string" },
          "framework": { "type": "string" }
        },
        "required": ["id", "file", "desc", "framework"],
        "additionalProperties": false
      }
    }
  },
  "required": ["tasks"],
  "additionalProperties": false
}
```

---

## 🛡️ Security Considerations

- **Authentication & Authorization**: Define roles, tokens, and permission checks from the start.
- **Data Validation**: Sanitize all inputs and define validation rules in tasks.
- **Secrets Management**: Use environment variables or a secrets vault—never hardcode credentials.
- **Audit & Logging**: Include hooks for audit trails and error monitoring in generated code.

---

## ❓ Uncertainty & Error Handling

- When Claude encounters ambiguity:

  1. **Halt** JSON output.
  2. **Ask** a targeted question specifying the unclear requirement.
  3. **Await** human response before proceeding.

---

## 🚀 Getting Started

1. **Clone** the repo.
2. **Configure** environment variables and security settings.
3. **Install** dependencies:

   ```bash
   npm install
   ```

4. **Generate** initial tasks:

   ```bash
   cli/init-tasks.sh  # Wraps system prompt to Claude
   ```

5. **Generate** code with Genmini:

   ```bash
   genmini create --input tasks.json
   ```

6. **Review** and implement logic.

---

## 📝 Contributing

- Document new architectural decisions in `ARCHITECTURE.md`.
- Update the JSON Schema when adding new task fields.
- Adhere to code style and security guidelines in `SECURITY.md`.

---

## 📜 License

Specify project license here (e.g., MIT).
