// Critically-damped spring stepper for physics-based motion.
// Used anywhere we want motion to feel like it has mass, not like an easing curve.
export interface SpringState {
  value: number
  velocity: number
}

export function springStep(
  state: SpringState,
  target: number,
  dt: number,
  stiffness = 170,
  damping = 24
): SpringState {
  const force = (target - state.value) * stiffness - state.velocity * damping
  const velocity = state.velocity + force * dt
  const value = state.value + velocity * dt
  return { value, velocity }
}
