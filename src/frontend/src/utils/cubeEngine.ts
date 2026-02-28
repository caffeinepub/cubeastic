import * as THREE from "three";

// Face indices for a cube
// 0 = Right (+X), 1 = Left (-X), 2 = Top (+Y), 3 = Bottom (-Y), 4 = Front (+Z), 5 = Back (-Z)

export type FaceColor =
  | "white"
  | "yellow"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "black";

export interface CubieState {
  position: [number, number, number]; // grid coordinates (integer)
  faceColors: [
    FaceColor,
    FaceColor,
    FaceColor,
    FaceColor,
    FaceColor,
    FaceColor,
  ]; // R L U D F B
  id: number;
}

// Standard face colors per face
export const FACE_COLORS: Record<string, FaceColor> = {
  right: "green",
  left: "blue",
  top: "white",
  bottom: "yellow",
  front: "red",
  back: "orange",
};

// Three.js color map for rendering
export const COLOR_MAP: Record<FaceColor, string> = {
  white: "#f0f0f0",
  yellow: "#ffd500",
  red: "#c41e3a",
  orange: "#ff5800",
  green: "#009b48",
  blue: "#0045ad",
  black: "#1a1a1a",
};

export function parseMoves(algorithm: string): string[] {
  if (!algorithm.trim()) return [];
  // Match move tokens: optional prefix digits, optional Rw/Lw/etc, letter, optional w, optional ', optional 2
  const moveRegex = /(?:\d+)?[RLUDFBMESxyz]w?['2]?/g;
  return algorithm.match(moveRegex) ?? [];
}

export function createSolvedState(n: number): CubieState[] {
  const cubies: CubieState[] = [];
  let id = 0;
  const half = (n - 1) / 2;

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      for (let z = 0; z < n; z++) {
        // Only create cubies on the surface
        if (x > 0 && x < n - 1 && y > 0 && y < n - 1 && z > 0 && z < n - 1) {
          continue;
        }

        const gx = x - half;
        const gy = y - half;
        const gz = z - half;

        const colors: [
          FaceColor,
          FaceColor,
          FaceColor,
          FaceColor,
          FaceColor,
          FaceColor,
        ] = [
          x === n - 1 ? "green" : "black", // Right
          x === 0 ? "blue" : "black", // Left
          y === n - 1 ? "white" : "black", // Top
          y === 0 ? "yellow" : "black", // Bottom
          z === n - 1 ? "red" : "black", // Front
          z === 0 ? "orange" : "black", // Back
        ];

        cubies.push({
          position: [gx, gy, gz],
          faceColors: colors,
          id: id++,
        });
      }
    }
  }

  return cubies;
}

// Get which cubies belong to a layer for a given move
export function getCubiesForMove(
  cubies: CubieState[],
  move: string,
  n: number,
): number[] {
  const half = (n - 1) / 2;
  const indices: number[] = [];

  // Parse the move to determine which layer(s)
  const normalized = normalizeMove(move);

  cubies.forEach((cubie, i) => {
    const [x, y, z] = cubie.position;
    if (affectedByMove(x, y, z, normalized, n, half)) {
      indices.push(i);
    }
  });

  return indices;
}

function normalizeMove(move: string): {
  axis: "x" | "y" | "z";
  layers: number[];
  dir: number;
} {
  // dir: 1 = clockwise, -1 = counterclockwise, 2 = 180
  let dir = 1;
  if (move.includes("'")) dir = -1;
  if (move.includes("2")) dir = 2;

  // Extract the base move letter
  const base = move.replace(/[0-9'2w]/g, "");
  const isWide = move.includes("w");

  // Map base move to axis and which layer
  // Layer index: for n=3, R is layer 2 (max), L is layer 0 (min)
  switch (base.toUpperCase()) {
    case "R":
      return { axis: "x", layers: isWide ? [1, 0] : [0], dir }; // positive x
    case "L":
      return { axis: "x", layers: isWide ? [-1, 0] : [-1], dir: -dir }; // negative x, reversed
    case "U":
      return { axis: "y", layers: isWide ? [1, 0] : [0], dir }; // positive y
    case "D":
      return { axis: "y", layers: isWide ? [-1, 0] : [-1], dir: -dir }; // negative y
    case "F":
      return { axis: "z", layers: isWide ? [1, 0] : [0], dir }; // positive z
    case "B":
      return { axis: "z", layers: isWide ? [-1, 0] : [-1], dir: -dir }; // negative z
    case "M":
      return { axis: "x", layers: [0], dir: -dir }; // middle x (same dir as L)
    case "E":
      return { axis: "y", layers: [0], dir: -dir }; // middle y (same dir as D)
    case "S":
      return { axis: "z", layers: [0], dir }; // middle z (same dir as F)
    case "RW":
      return { axis: "x", layers: [1, 0], dir };
    case "LW":
      return { axis: "x", layers: [-1, 0], dir: -dir };
    case "UW":
      return { axis: "y", layers: [1, 0], dir };
    case "DW":
      return { axis: "y", layers: [-1, 0], dir: -dir };
    case "FW":
      return { axis: "z", layers: [1, 0], dir };
    case "BW":
      return { axis: "z", layers: [-1, 0], dir: -dir };
    default:
      return { axis: "y", layers: [0], dir };
  }
}

function affectedByMove(
  x: number,
  y: number,
  z: number,
  normalized: { axis: "x" | "y" | "z"; layers: number[] },
  _n: number,
  half: number,
): boolean {
  const { axis, layers } = normalized;

  for (const layer of layers) {
    if (layer === 0) {
      // outer positive face
      if (axis === "x" && x === half) return true;
      if (axis === "y" && y === half) return true;
      if (axis === "z" && z === half) return true;
    } else if (layer === -1) {
      // outer negative face
      if (axis === "x" && x === -half) return true;
      if (axis === "y" && y === -half) return true;
      if (axis === "z" && z === -half) return true;
    } else if (layer === 1) {
      // second layer from positive side
      const second = half - 1;
      if (second >= 0) {
        if (axis === "x" && x === second) return true;
        if (axis === "y" && y === second) return true;
        if (axis === "z" && z === second) return true;
      }
    }
  }
  return false;
}

export function getRotationForMove(move: string): {
  axis: THREE.Vector3;
  angle: number;
} {
  const normalized = normalizeMove(move);
  const { axis, dir } = normalized;

  let angle: number;
  if (dir === 2) {
    angle = Math.PI;
  } else {
    angle = (Math.PI / 2) * dir;
  }

  // THREE.js: Y is up, Z is forward toward viewer, X is right
  const axisVecMap: Record<string, THREE.Vector3> = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
  };
  const axisVec = axisVecMap[axis] ?? new THREE.Vector3(0, 1, 0);

  return { axis: axisVec, angle };
}

// Apply a rotation matrix to a position (for updating cubie positions after move)
export function rotatePosition(
  pos: [number, number, number],
  axis: "x" | "y" | "z",
  dir: number,
): [number, number, number] {
  const [x, y, z] = pos;

  const sin90 = 1;
  const cos90 = 0;

  const actualDir = dir === 2 ? 2 : dir;

  if (axis === "x") {
    if (actualDir === 2) {
      return [x, -y, -z];
    }
    const ny = Math.round(cos90 * y - sin90 * dir * z);
    const nz = Math.round(sin90 * dir * y + cos90 * z);
    return [x, ny, nz];
  }
  if (axis === "y") {
    if (actualDir === 2) {
      return [-x, y, -z];
    }
    const nx = Math.round(cos90 * x + sin90 * dir * z);
    const nz = Math.round(-sin90 * dir * x + cos90 * z);
    return [nx, y, nz];
  }
  // axis === "z"
  if (actualDir === 2) {
    return [-x, -y, z];
  }
  const nx = Math.round(cos90 * x - sin90 * dir * y);
  const ny = Math.round(sin90 * dir * x + cos90 * y);
  return [nx, ny, z];
}

// Apply a move to the cube state, returning new state
export function applyMove(
  cubies: CubieState[],
  move: string,
  n: number,
): CubieState[] {
  const half = (n - 1) / 2;
  const normalized = normalizeMove(move);
  const { axis, dir, layers } = normalized;

  return cubies.map((cubie) => {
    const [x, y, z] = cubie.position;
    let affected = false;

    for (const layer of layers) {
      if (layer === 0) {
        if (axis === "x" && x === half) {
          affected = true;
          break;
        }
        if (axis === "y" && y === half) {
          affected = true;
          break;
        }
        if (axis === "z" && z === half) {
          affected = true;
          break;
        }
      } else if (layer === -1) {
        if (axis === "x" && x === -half) {
          affected = true;
          break;
        }
        if (axis === "y" && y === -half) {
          affected = true;
          break;
        }
        if (axis === "z" && z === -half) {
          affected = true;
          break;
        }
      } else if (layer === 1) {
        const second = half - 1;
        if (second >= 0) {
          if (axis === "x" && x === second) {
            affected = true;
            break;
          }
          if (axis === "y" && y === second) {
            affected = true;
            break;
          }
          if (axis === "z" && z === second) {
            affected = true;
            break;
          }
        }
      }
    }

    if (!affected) return cubie;

    const newPos = rotatePosition([x, y, z], axis, dir);
    const newColors = rotateColors(cubie.faceColors, axis, dir);

    return {
      ...cubie,
      position: newPos,
      faceColors: newColors,
    };
  });
}

// Rotate the face colors of a cubie when it gets rotated
function rotateColors(
  colors: [FaceColor, FaceColor, FaceColor, FaceColor, FaceColor, FaceColor],
  axis: "x" | "y" | "z",
  dir: number,
): [FaceColor, FaceColor, FaceColor, FaceColor, FaceColor, FaceColor] {
  // colors index: 0=R, 1=L, 2=T, 3=B(ottom), 4=F, 5=Back
  const [r, l, t, b, f, bk] = colors;

  if (dir === 2) {
    if (axis === "x") return [r, l, b, t, bk, f];
    if (axis === "y") return [l, r, t, b, bk, f];
    return [l, r, b, t, f, bk];
  }

  if (axis === "x") {
    // Rotating around X axis
    if (dir === 1) return [r, l, f, bk, b, t]; // CW when viewed from +X
    return [r, l, bk, f, t, b]; // CCW
  }
  if (axis === "y") {
    // Rotating around Y axis
    if (dir === 1) return [bk, f, t, b, r, l]; // CW when viewed from +Y
    return [f, bk, t, b, l, r]; // CCW
  }
  // Rotating around Z axis
  if (dir === 1) return [b, t, r, l, f, bk]; // CW when viewed from +Z
  return [t, b, l, r, f, bk]; // CCW
}
