// PostToolUse hook: runs Prettier on the file an Edit/Write/MultiEdit just touched.
// Reads the hook payload (JSON) from stdin and formats tool_input.file_path.
// Never blocks the agent: any problem is reported on stderr and the hook exits 0.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

let input = ''
for await (const chunk of process.stdin) input += chunk

let filePath
try {
  filePath = JSON.parse(input)?.tool_input?.file_path
} catch {
  process.exit(0)
}
if (typeof filePath !== 'string' || !existsSync(filePath)) process.exit(0)

// Only format files inside this project.
const rel = path.relative(projectDir, path.resolve(projectDir, filePath))
if (rel.startsWith('..') || path.isAbsolute(rel)) process.exit(0)

const prettier = path.join(projectDir, 'node_modules', '.bin', 'prettier')
if (!existsSync(prettier)) process.exit(0)

// --ignore-unknown skips file types Prettier can't parse; .prettierignore is honoured.
const r = spawnSync(prettier, ['--write', '--ignore-unknown', '--log-level', 'warn', rel], { cwd: projectDir, encoding: 'utf8' })
if (r.status !== 0) process.stderr.write(`format hook: prettier failed on ${rel}\n${r.stderr ?? ''}`)
process.exit(0)
