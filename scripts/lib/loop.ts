// Pure decision for the build loop. The script counts attempts; the agent never does.
export const MAX_ATTEMPTS = 3

export interface Attempt {
  /** What the agent said it did (one line). */
  summary: string
  /** The agent's own verdict. Advisory only: the gate decides. */
  verdict: 'ok' | 'failed' | 'needs_human'
  question?: string
  /** Results of the gate runs after this attempt, in order. Stable green = two passes in a row. */
  gates: { pass: boolean; newFailures: string[] }[]
}

export type Decision = { kind: 'done' } | { kind: 'attempt' } | { kind: 'escalate'; reason: string; question: string }

export const isStable = (a: Attempt) => a.gates.length >= 2 && a.gates.slice(-2).every((g) => g.pass)
/** The failures this attempt ended with, as a comparable signature. */
export const signature = (a: Attempt) => [...(a.gates.at(-1)?.newFailures ?? [])].sort().join('\n')

// Step 2: write this. The rules, in order (scripts/lib/loop.test.ts checks each one):
//   no attempt yet → attempt · stable green (isStable) → done · the agent asked (needs_human) → escalate
//   the same non-empty failures twice in a row (signature) → escalate · max attempts used → escalate · else → attempt
// The agent's own verdict "ok" never counts: only the gate does.
export function decide(attempts: Attempt[], max = MAX_ATTEMPTS): Decision {
  const last = attempts.at(-1)
  if (!last) return { kind: 'attempt' }
  if (isStable(last)) return { kind: 'done' }
  if (last.verdict === 'needs_human')
    return { kind: 'escalate', reason: 'the agent asked a question', question: last.question ?? 'The agent needs a human decision; see the attempt summary.' }
  const prev = attempts.at(-2)
  const sig = signature(last)
  if (prev && sig !== '' && sig === signature(prev))
    return {
      kind: 'escalate',
      reason: 'two attempts in a row failed the same way',
      question: `These failures did not change between attempts:\n${sig}\nHow should they be fixed?`,
    }
  if (attempts.length >= max)
    return {
      kind: 'escalate',
      reason: `${max} attempts used`,
      question: `No stable green gate after ${max} attempts. How should the remaining failures be fixed?`,
    }
  return { kind: 'attempt' }
}
