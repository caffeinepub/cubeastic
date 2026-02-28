export type CubeSize = "2x2" | "3x3" | "4x4" | "5x5" | "6x6";

export interface TutorialStep {
  title: string;
  description: string;
  algorithm: string;
  tip?: string;
}

export interface CubeTutorial {
  size: CubeSize;
  label: string;
  dimension: number;
  tagline: string;
  color: string;
  steps: TutorialStep[];
}

export const TUTORIALS: Record<CubeSize, CubeTutorial> = {
  "2x2": {
    size: "2x2",
    label: "2×2",
    dimension: 2,
    tagline: "Pocket Cube — perfect for beginners",
    color: "oklch(0.72 0.2 50)",
    steps: [
      {
        title: "Learn the Notation",
        description:
          "Before solving, you need to understand move notation. R means rotate the Right face clockwise. U means rotate the Upper (top) face clockwise. F is Front, L is Left, D is Down, B is Back. A prime symbol (') means counterclockwise. A 2 means turn it twice (180°). Practice this sequence to feel the moves.",
        algorithm: "R U R' U'",
        tip: "Hold your cube with white on top and green facing you throughout this step.",
      },
      {
        title: "Solve the First Layer",
        description:
          "Place the cube with your chosen bottom color (white) facing down. Find all 4 corner pieces that have white on them and move them to the bottom layer in their correct positions. Use the R' D' R D sequence repeatedly until each corner is correctly placed.",
        algorithm: "R' D' R D",
        tip: "Repeat this algorithm up to 6 times until the corner pops into its correct spot.",
      },
      {
        title: "Orient Last Layer Corners",
        description:
          "Now flip the cube so the solved face is on the bottom. Look at the top face — you need to make all corners show the same color (yellow). This algorithm will cycle the orientation of the top corners. Keep applying it until all top corners show yellow.",
        algorithm: "R U R' U R U2 R'",
        tip: "Hold a corner that needs fixing in the front-right-top position before executing.",
      },
      {
        title: "Permute Last Layer Corners",
        description:
          "The last step! The top face should now be all one color. Rotate the top layer to check if any corners are already in their correct positions. This algorithm swaps 3 corners at once to place them correctly. You may need to do it twice.",
        algorithm: "R' F R' B2 R F' R' B2 R2",
        tip: "If one corner is already in place, hold that corner in the back-left position.",
      },
    ],
  },
  "3x3": {
    size: "3x3",
    label: "3×3",
    dimension: 3,
    tagline: "The classic — master the iconic puzzle",
    color: "oklch(0.78 0.18 75)",
    steps: [
      {
        title: "White Cross",
        description:
          "Start by making a white cross on the bottom face. You need 4 white edge pieces (pieces with white on one side) placed correctly around the white center. Each edge should also have its side color matching the corresponding center. Use F R U R' U' F' to help orient edges.",
        algorithm: "F R U R' U' F'",
        tip: "Look for white edges on the top layer first — they're easier to work with.",
      },
      {
        title: "White Corners (First Layer)",
        description:
          "Now fill in the 4 white corners to complete the first layer. Find each white corner piece, move it above its target position (matching the two side colors with their centers), then use this algorithm repeatedly to insert it correctly.",
        algorithm: "R' D' R D",
        tip: "Use up to 6 repetitions. If the corner is stuck in the bottom, bring it up first with: R' D R.",
      },
      {
        title: "Second Layer Edges",
        description:
          "Flip the cube so white is on the bottom. Now solve the 4 middle layer edges. Find an edge on the top layer that has no yellow. Match its top color to the center, then use this algorithm to insert it left or right. For left insertion, use the mirror: U' L' U L U F U' F'.",
        algorithm: "U R U' R' U' F' U F",
        tip: "If all edges are in the middle layer but wrong, pop one out first using either algorithm.",
      },
      {
        title: "Yellow Cross (OLL)",
        description:
          "Look at the top face. You need to form a yellow cross. You might see a dot, an L-shape, or a line of yellow on top. This algorithm changes those patterns. A dot takes 3 applications, an L-shape takes 2, and a line takes 1.",
        algorithm: "F R U R' U' F'",
        tip: "For an L-shape, hold it in the back-left corner. For a line, hold it horizontally.",
      },
      {
        title: "Orient Yellow Corners",
        description:
          "Now orient all top corners to show yellow. Look for corners that already show yellow on top — rotate the top layer to put one in the front-right-top position, then apply this algorithm. Keep the cube in place — only apply to front-right-top corner until yellow shows.",
        algorithm: "R U R' U R U2 R'",
        tip: "Don't rotate the entire cube during this step! Only rotate the top layer between repetitions.",
      },
      {
        title: "Permute Last Layer",
        description:
          "Now position the last layer edges correctly. You're looking for two edge pieces that are already in the correct position (or close to it). Hold those in the back and left, then apply this algorithm to cycle the front, right, and back edges.",
        algorithm: "U R U' L' U R' U' L",
        tip: "If no edges are solved, do the algorithm once and check again.",
      },
      {
        title: "Final Adjustments (PLL)",
        description:
          "The final step! Permute the last layer corners. You need to get all 4 corners to their correct positions. Apply this algorithm and check after. You may need to apply it 2-3 times, each time turning the top layer to find new headlights (two corners of the same color on one face).",
        algorithm: "R' U L' U2 R U' R' U2 R L",
        tip: "After the cube is solved, you'll just need a few U moves to align the last layer. Congratulations!",
      },
    ],
  },
  "4x4": {
    size: "4x4",
    label: "4×4",
    dimension: 4,
    tagline: "Revenge Cube — advanced mechanics",
    color: "oklch(0.65 0.18 150)",
    steps: [
      {
        title: "Centers First",
        description:
          "The 4x4 has no fixed centers — you must build them! Each face has a 2x2 center block of 4 pieces. Start with white center on the bottom and yellow on top. Use wide moves (Rw means the rightmost two layers together) to move center pieces without disturbing others.",
        algorithm: "Rw U Rw' U Rw U2 Rw'",
        tip: "Build opposite centers first (white/yellow, red/orange, green/blue) to avoid interference.",
      },
      {
        title: "Edge Pairing",
        description:
          "Now pair up the edge pieces. Each edge slot needs 2 matching pieces placed together. Use slice moves and wide moves to bring matching edge pieces together without breaking the centers. The Uw move rotates the top two layers together.",
        algorithm: "Uw R U R' Fw R' Fw' R Uw'",
        tip: "Try to pair edges that are near each other in the scramble to save moves.",
      },
      {
        title: "Solve as 3x3",
        description:
          "After pairing all edges and building all centers, the 4x4 behaves exactly like a 3x3! Use your 3x3 methods: white cross, first layer corners, second layer edges, OLL, and PLL. Treat each paired edge as a single 3x3 edge piece.",
        algorithm: "R U R' U'",
        tip: "If you get parity errors, don't panic — they're fixable with special algorithms.",
      },
      {
        title: "OLL Parity Fix",
        description:
          "OLL Parity happens when a single edge appears flipped on the last layer — this is impossible on a 3x3! It occurs because you may have an odd number of edge swaps. This long algorithm fixes it. After fixing, continue with normal OLL.",
        algorithm: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
        tip: "The 'x' in this algorithm means tilt the entire cube forward (x rotation).",
      },
      {
        title: "PLL Parity Fix",
        description:
          "PLL Parity occurs when only two edges need to be swapped — also impossible on a standard 3x3. This algorithm directly swaps two adjacent edges. After this fix, complete the PLL normally. You're almost done!",
        algorithm: "2R2 U2 2R2 Uw2 2R2 Uw2",
        tip: "'2R' means only the second layer from the right (not the outer layer).",
      },
    ],
  },
  "5x5": {
    size: "5x5",
    label: "5×5",
    dimension: 5,
    tagline: "Professor Cube — true mastery",
    color: "oklch(0.55 0.18 240)",
    steps: [
      {
        title: "Solve Centers",
        description:
          "The 5x5 centers are 3x3 grids of 9 pieces each. Build them systematically — start with the cross pattern (center + 4 adjacent pieces), then fill in the corners. Use wide moves carefully to avoid breaking completed centers. The Rw move rotates the two right layers together.",
        algorithm: "Rw U Rw' U Rw U2 Rw'",
        tip: "Complete two opposite centers at once when possible to maximize efficiency.",
      },
      {
        title: "Pair Edges",
        description:
          "Each edge slot on a 5x5 needs 3 matching edge pieces placed together. Work on one edge at a time using a pairing slot on the top. Bring in pieces one by one without breaking already paired edges. The Uw move (wide U) is key for swapping edge slots.",
        algorithm: "Uw R U R' Uw'",
        tip: "Use a free (unsolved) edge slot as a workspace when pairing tricky edges.",
      },
      {
        title: "Solve as 3x3",
        description:
          "With all centers solved and edges paired, the 5x5 reduces to a 3x3. Apply your full 3x3 method: cross, corners, middle layer, OLL, PLL. Remember that each group of 3 edge pieces acts as one 3x3 edge.",
        algorithm: "R U R' U'",
        tip: "Be careful with wide moves during the 3x3 phase — they can unpair your edges.",
      },
      {
        title: "OLL Parity",
        description:
          "Just like the 4x4, the 5x5 can get an OLL parity where a single edge appears flipped. This 5x5 OLL parity fix is a powerful algorithm that corrects the flip. Execute it carefully and then finish your OLL normally.",
        algorithm: "Rw' U2 Rw' U2 F2 Rw' F2 Lw U2 Lw' U2 Rw2",
        tip: "Keep the flipped edge at the front-top position when executing this algorithm.",
      },
      {
        title: "PLL Parity",
        description:
          "PLL Parity on the 5x5 swaps two edges that seem impossible to fix with normal 3x3 algorithms. Apply this algorithm with the two misplaced edges at specified positions. After this, complete the PLL and you're done with the Professor Cube!",
        algorithm: "2R2 U2 2R2 Uw2 2R2 Uw2",
        tip: "Celebrate! Solving a 5x5 puts you in a very small club of dedicated cubers.",
      },
    ],
  },
  "6x6": {
    size: "6x6",
    label: "6×6",
    dimension: 6,
    tagline: "The Giant — supreme challenge",
    color: "oklch(0.65 0.15 185)",
    steps: [
      {
        title: "Build Centers",
        description:
          "The 6x6 has massive 4x4 center blocks (16 pieces each) that must be solved. Use the '3Rw' notation meaning three layers from the right move together. Build centers systematically, using a combination of setup moves and commutators. Start with the most straightforward color.",
        algorithm: "3Rw U 3Rw' U 3Rw U2 3Rw'",
        tip: "The 6x6 center building is the hardest part — take your time and don't rush.",
      },
      {
        title: "Pair All Edges",
        description:
          "Each edge on a 6x6 has 4 matching pieces that need to be grouped together. This is a long process — the 6x6 has 12 edge slots, each needing 4 pieces. Use systematic pairing with '3Uw' (three top layers) to cycle edge slots without disrupting centers.",
        algorithm: "3Uw R U R' 3Uw'",
        tip: "Count your edges as you go — it's easy to lose track on the 6x6.",
      },
      {
        title: "Reduce and Solve",
        description:
          "After solving all centers and pairing all edges, treat the 6x6 as a 3x3. Apply your standard 3x3 solution: cross, layer by layer, OLL, PLL. This is the reward for all the reduction work you just did! Standard outer-layer moves are safe here.",
        algorithm: "R U R' U'",
        tip: "You're close to finishing one of the hardest standard Rubik's cubes available!",
      },
      {
        title: "Fix OLL Parity",
        description:
          "OLL parity on the 6x6 manifests as a single flipped edge on the last layer. This requires an even longer fix algorithm than smaller cubes. The '3Rw' and '3Lw' moves operate on three layers simultaneously. Execute this carefully.",
        algorithm: "3Rw' U2 3Rw' U2 F2 3Rw' F2 3Lw U2 3Lw' U2 3Rw2",
        tip: "Break the algorithm into smaller chunks and practice each section separately.",
      },
      {
        title: "Fix PLL Parity",
        description:
          "The final challenge: PLL parity on the 6x6. Two edges appear to need swapping in a way that's impossible on a 3x3. This algorithm fixes it by operating on inner layers. After this, complete your final PLL and the 6x6 is solved! You've mastered one of the world's hardest mass-produced puzzles.",
        algorithm: "3R2 U2 3R2 3Uw2 3R2 3Uw2",
        tip: "You've done it! The 6x6 is a true test of patience, memory, and cubing skill.",
      },
    ],
  },
};
