/**
 * Small helpers for the voice demo block's call (voice-demo.tsx), kept apart
 * from the component so node's own test runner can check them: no React, and
 * nothing from the browser is touched until a function is called.
 *
 * What they are for: three ways a press could leave the visitor stuck.
 *   - an older Safari has no AbortSignal.timeout, so the press threw before
 *     the session was even asked for (timeoutSignal);
 *   - the voice SDK starts out in its "connecting" state and so never
 *     announces it (FIRST_STATE);
 *   - a call can connect with no assistant ever joining it, and the page
 *     then showed a spinner with End call for eight minutes (joinWatch).
 *
 * Engineering defaults, 2026-11-15 (the overnight review): JOIN_TIMEOUT_MS.
 */

/**
 * How long a call may go, from the moment it starts connecting, without the
 * assistant joining it, before the page hangs up and says the call did not
 * connect. In the 2026-11-13 trial a session was minted in about a second;
 * thirty is far past any healthy start.
 */
export const JOIN_TIMEOUT_MS = 30_000;

/** What the page shows from the moment the SDK is asked to start, until the SDK reports a state of its own. */
export const FIRST_STATE = "connecting";

/** True for the states that mean the assistant is on the call. */
export function agentJoined(state: string): boolean {
  return state === "listening" || state === "thinking" || state === "speaking";
}

/**
 * A signal that aborts after `ms`: AbortSignal.timeout where the browser has
 * it, a plain controller and a timer where it does not (Safari before 16).
 */
export function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal.timeout === "function") return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

export type JoinWatch = {
  /** The assistant is on the call: the watch is over. */
  joined: () => void;
  /** The call ended some other way: the watch is over. */
  cancel: () => void;
};

/**
 * Waits `ms` for the assistant to join. `onLate` runs once if neither
 * joined() nor cancel() was called first; after any of the three, nothing
 * more happens.
 */
export function joinWatch(ms: number, onLate: () => void): JoinWatch {
  let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    timer = null;
    onLate();
  }, ms);
  const stop = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
  return { joined: stop, cancel: stop };
}
