# Cubeastic

## Current State
- App shows a cube selector (2x2 through 6x6), then a tutorial view.
- Tutorial view has step tabs (numbered buttons) at the top-left that allow jumping to any step.
- The 3D cube starts in a solved state for every step and animates the step's algorithm when Play is pressed.
- There is no visual representation of the "situation" (starting cube state) for each step before the algorithm is played.
- Step tabs are minimal number buttons without titles/labels.

## Requested Changes (Diff)

### Add
- Each tutorial step should have a `setupMoves` field in `tutorialData.ts` — a sequence of moves that scrambles the cube into the situation that the step addresses (e.g. for "Yellow Cross" the top layer is already in a cross-needed state). This setup state is pre-applied to the cube when the user lands on a step so they see the actual scenario.
- The step selection tabs should show the step title (not just number) so users understand what each step covers at a glance. Use a scrollable horizontal list of labeled tab buttons.
- When a user clicks a step tab, the 3D cube should immediately show the pre-set starting position for that step (setup moves applied instantly, no animation) before the algorithm is played.
- Add a visual "step overview" panel or sidebar that lists all steps with their titles so users can browse and pick steps easily. On mobile this can be a scrollable horizontal row; on desktop a vertical sidebar list.

### Modify
- `TutorialStep` interface: add optional `setupMoves?: string` field.
- `tutorialData.ts`: add `setupMoves` for each step where a meaningful starting situation applies (e.g. first layer corners step might show a partially-solved cube with cross done but corners missing).
- `RubiksCube3D` / `CubeScene`: accept a `setupMoves` prop. When `setupMoves` changes (step changes), instantly apply those moves to the cube state without animation to set the starting situation.
- `TutorialView`: pass the current step's `setupMoves` to `RubiksCube3D`; clicking a step tab applies setup instantly and resets the algorithm playback.
- Step tabs: replace the number-only buttons with compact labeled tabs showing step number + title, scrollable horizontally.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `TutorialStep` interface in `tutorialData.ts` to add `setupMoves?: string`.
2. Add `setupMoves` values to each tutorial step across all cube sizes (meaningful starting cube states).
3. Update `CubeScene` in `RubiksCube3D.tsx` to accept `setupMoves?: string` prop and apply it instantly (no animation) whenever the prop changes (step change), resetting the cube to that state before any algorithm animation.
4. Update `RubiksCube3D` component interface to pass through `setupMoves`.
5. Update `TutorialView` to:
   - Pass `setupMoves` from current step to `RubiksCube3D`.
   - Make step tabs show step number + truncated title label instead of just numbers.
   - On step change, reset cube with new setup moves.
6. Validate: typecheck and build pass.
