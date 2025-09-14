# obsidian-capitalise-plugin
An Obsidian plugin that cycles text capitalisation (lowercase → UPPERCASE → Capitalise Each Word) using Shift+F3, just like Microsoft Word

---

## Progress

### 1 Development environment set-up (Windows 11 + VS Code + GitHub)

- [x] 1.1 Prerequisites
- [ ] 1.2 Create the plugin project
- [ ] 1.3 Connect to your vault for testing
- [ ] 1.4 Dev workflow (fast feedback)
- [ ] 1.5 Git & GitHub

### 2 Development roadmap

### Progress
- [ ] Milestone 0 — Skeleton & “Hello World!”
- [ ] Milestone 1 — Uppercase selection
- [ ] Milestone 2 — Add full Shift+F3 cycle

---

## 1 Development environment set-up (Windows 11 • VS Code • GitHub)

### 1.1 Prerequisites

* **Obsidian** (latest) installed and a **test vault** ready.
* **Node.js LTS** (includes `npm`). Verify:

```powershell
node -v
npm -v
```
  
* **Git** (for version control and GitHub).
* **VS Code** with recommended extensions:

  * “ESLint” (optional but helpful)
  * “TypeScript and JavaScript Language Features” (built-in)
* **GitHub account** (for remote repo and releases).



### 1.2 Create the plugin project

> First, create your own GitHub repository (with LICENSE and README). Then, import the official sample plugin files into your repo and continue setup.

1. **Create your own GitHub repository**:

   - On GitHub, click **New repository** and follow the prompts to create a repo (e.g., `obsidian-capitalise-plugin`).
   - Add a `LICENSE` and `README.md` when prompted.
   - Clone your new repo to your local machine:

     ```powershell
     git clone https://github.com/<your-username>/obsidian-capitalise-plugin.git
     cd obsidian-capitalise-plugin
     ```

2. **Copy the sample plugin files into your repo**:

   - Download or clone the [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) to a temporary folder:

     ```powershell
     git clone https://github.com/obsidianmd/obsidian-sample-plugin temp-sample-plugin
     ```

   - Copy the following files from `temp-sample-plugin` into your repository root (do **not** overwrite your LICENSE or README.md):
     - `AGENTS.md` (if present)
     - `esbuild.config.mjs`
     - `main.ts`
     - `manifest.json`
     - `package.json`
     - `styles.css`
     - `tsconfig.json`
     - `version-bump.mjs` (if present)
     - `versions.json` (if present)

   - Delete the `temp-sample-plugin` folder when done.

2. **Clean and rename**:

   * In `manifest.json`:
     * `id`: `"obsidian-capitalise-plugin"`
     * `name`: `"Obsidian Capitalise Plugin"`
     * `version`: `"0.1.0"`
     * `minAppVersion`: keep as in sample (or latest you use)
     * `author`: your name
     * `description`: `"Cycle text capitalisation like Word (Shift+F3)."`

   * In `package.json`:
     * Set `name` and `version` to match your plugin, for example:

       ```json
       {
         "name": "obsidian-capitalise-plugin",
         "version": "0.1.0",
         // ...other fields...
       }
       ```

3. **Install deps** (kept minimal—TypeScript + esbuild):

```powershell
npm install
```

   (The sample already includes `esbuild`, `typescript`, and `@types/node`. Avoid extra libraries.)

4. **Project structure (lean)**

```
  obsidian-capitalise-plugin/
  ├─ LICENSE                # your existing license
  ├─ README.md              # your existing readme
  ├─ AGENTS.md              # (if present)
  ├─ esbuild.config.mjs     # build config
  ├─ main.ts                # plugin code (entry point)
  ├─ manifest.json          # Obsidian metadata
  ├─ package.json           # npm metadata
  ├─ styles.css             # optional; can be empty
  ├─ tsconfig.json          # TypeScript config
  ├─ version-bump.mjs       # (if present)
  └─ versions.json          # (if present)
```

### 1.3 Connect to your vault for testing

1. **Build once**:

```powershell
npm run build
```

2. **Link into your vault**:

  * Create folder: `<YourVault>/.obsidian/plugins/obsidian-capitalise-plugin/`
  * Copy `manifest.json`, `main.js`, and `styles.css` into that folder (or use a symlink/junction during development).

3. **Enable in Obsidian**:

  * Settings → **Community plugins** → **Turn off Safe mode** → **Browse** (not needed here) → **Enabled plugins** → toggle **Obsidian Capitalise Plugin**.

4. **Assign hotkey**:

  * Settings → **Hotkeys** → search your command (you’ll add it in code) → assign **Shift+F3**.
  * Note: if Shift+F3 is taken by another command/system, rebind it.

### 1.4 Dev workflow (fast feedback)

* Run a watch build:

  ```powershell
  npm run dev
  ```

* After edits, in Obsidian press **Ctrl+R** (reload UI) to pick up the rebuilt `main.js`.

  * This avoids extra tooling/hot-reload plugins.

### 1.5 Git & GitHub

1. **Initial commit & remote**:

   ```powershell
   git init
   git add .
   git commit -m "chore: scaffold plugin"
   git branch -M main
  git remote add origin https://github.com/<you>/obsidian-capitalise-plugin.git
   git push -u origin main
   ```
   
2. **Releases** (later):

   * Tag versions (`git tag v0.1.0 && git push --tags`) and publish a GitHub Release attaching `main.js`, `manifest.json`, `styles.css`.

---

## 2 Development roadmap (incremental features → from “Hello World!” to full Shift+F3)

> Goal: ship value early, keep dependencies minimal, and harden behaviour iteratively.

### Milestone 0 — Skeleton & “Hello World!” (Day 1)

* **Add a command** that inserts text at the cursor.
* **Bind Shift+F3** in Hotkeys to this command.
* **Acceptance**: Pressing Shift+F3 inserts `Hello World!`.

**Sketch (`src/main.ts`)**

```ts
import { App, Editor, MarkdownView, Plugin } from "obsidian";

export default class ShiftF3CapitalisePlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "shift-f3-hello-world",
      name: "Shift+F3: Hello World",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        editor.replaceSelection("Hello World!");
      }
    });
  }
}
```

### Milestone 1 — Uppercase selection

* Replace the “Hello World!” command with **“Transform selection to UPPERCASE”**.
* Behaviour:

  * If **selection exists** → replace with UPPERCASE.
  * If **no selection** → do nothing (for now).
* **Acceptance**: Selected text becomes UPPERCASE.

### Milestone 2 — Add full **Shift+F3 cycle**

* Implement **cycle**: `lowercase → UPPERCASE → Capitalise Each Word → lowercase …`
* Scope: **single selection** only.
* Store last state per invocation to determine the next transform; alternatively, **infer state** from the current selection (simpler and stateless: if selection equals its own lowercase, go UPPERCASE; if equals UPPERCASE, go Capitalise; else go lowercase).
* **Acceptance**: Repeated Shift+F3 presses cycle modes on the same selection.

### Milestone 3 — Handle **no selection** (current word)

* If there’s **no selection**, detect the **current word boundaries** (letters/numbers/underscore; stop at whitespace/punctuation) and apply the cycle to that word.
* **Acceptance**: Caret inside a word cycles that word’s case.

### Milestone 4 — Multi-selection & multi-cursor

* Support Obsidian’s multiple carets/selections: apply the cycle **independently** to each range.
* **Acceptance**: With multiple selections, each cycles correctly.

### Milestone 5 — Respect Markdown semantics (non-destructive)

* **Do not** alter:

  * Code fences (\`\`\`), inline code (`code`), links’ **URLs** (keep display text transform allowed), and frontmatter.
* Strategy:

  * For each selection/word, **detect context** using the editor API (or simple heuristics):

    * If inside code block/inline code/frontmatter, **skip**.
    * If inside a link: transform only the **link text**, not the destination.
* **Acceptance**: Cycling inside code/frontmatter does nothing; link display text cycles while URL remains intact.

### Milestone 6 — Title-case refinements

* Implement **Capitalise Each Word** with better rules:

  * Lowercase short conjunctions/prepositions/articles except when first/last: e.g., “and, or, the, a, an, of, in, to, for, on”.
  * Preserve **apostrophes** and **hyphenated** words sensibly: “don’t” → “Don’t”, “state-of-the-art” → “State-of-the-Art”.
* **Acceptance**: Common English title-case expectations met.

### Milestone 7 — Locale & edge cases

* Add basic **locale-aware** handling (at least UK English defaults).
* Handle **mixed scripts**, **accented letters**, and **emoji** without breaking selection ranges.
* **Acceptance**: Transforms operate safely on typical European accents and do not corrupt text.

### Milestone 8 — Settings & customisation

* Add a **Settings tab**:

  * Toggle which cases participate in the cycle (e.g., include **Sentence case**).
  * Configure the **short-word list** for title-case.
  * Option to **apply to headings only** when no selection (optional).
* **Acceptance**: User settings persist and change behaviour.

### Milestone 9 — Performance, UX polish, and tests

* Performance: operate on buffers in-place; avoid unnecessary allocations.
* Undo/redo: ensure each press is a single undo step.
* Add lightweight tests (e.g., export pure transform functions and test with Node).
* **Acceptance**: Smooth typing experience; predictable undo.

### Milestone 10 — Documentation & release

* Write a concise **README** (install, features, limitations, hotkey setup).
* Prepare **CHANGELOG** and **version bump**.
* Tag and publish **v0.1.0** on GitHub with `manifest.json`, `main.js`, `styles.css`.
* Optional: submit to Obsidian Community Plugins following their guidelines.

---

### Notes & constraints

* **No heavy third-party dependencies**: keep to Obsidian API + TypeScript + esbuild.
* Obsidian won’t let a plugin *force* a global hotkey; users bind **Shift+F3** in **Settings → Hotkeys** to your command.
* Keep transforms **pure** and **unit-testable** (pass strings in, get strings out) for reliability.

