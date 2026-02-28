import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  COLOR_MAP,
  type CubieState,
  applyMove,
  createSolvedState,
  getCubiesForMove,
  getRotationForMove,
  parseMoves,
} from "../utils/cubeEngine";

// ─── Cubie (single small cube) ───────────────────────────────────────────────

interface CubieProps {
  cubie: CubieState;
  cubieSize: number;
  gap: number;
}

function Cubie({ cubie, cubieSize, gap }: CubieProps) {
  const [px, py, pz] = cubie.position;
  const s = cubieSize + gap * 0.5;
  const faceSize = cubieSize * 0.92;

  // faceColors: 0=R(+x), 1=L(-x), 2=Top(+y), 3=Bot(-y), 4=F(+z), 5=Bk(-z)
  const faceOffsets: [number, number, number][] = [
    [s / 2, 0, 0], // R
    [-s / 2, 0, 0], // L
    [0, s / 2, 0], // Top
    [0, -s / 2, 0], // Bottom
    [0, 0, s / 2], // Front
    [0, 0, -s / 2], // Back
  ];

  const faceRotations: [number, number, number][] = [
    [0, Math.PI / 2, 0], // R
    [0, -Math.PI / 2, 0], // L
    [-Math.PI / 2, 0, 0], // Top
    [Math.PI / 2, 0, 0], // Bottom
    [0, 0, 0], // Front
    [0, Math.PI, 0], // Back
  ];

  return (
    <group position={[px * s, py * s, pz * s]}>
      {/* Core black box */}
      <mesh>
        <boxGeometry
          args={[cubieSize * 0.98, cubieSize * 0.98, cubieSize * 0.98]}
        />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Colored stickers */}
      {cubie.faceColors.map((color, fi) => {
        if (color === "black") return null;
        const faceNames = ["R", "L", "T", "Bo", "F", "Bk"];
        return (
          <mesh
            key={faceNames[fi]}
            position={faceOffsets[fi]}
            rotation={faceRotations[fi]}
          >
            <planeGeometry args={[faceSize, faceSize]} />
            <meshStandardMaterial
              color={COLOR_MAP[color]}
              roughness={0.3}
              metalness={0.1}
              side={THREE.FrontSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Animated Cube Scene ─────────────────────────────────────────────────────

interface CubeSceneProps {
  n: number;
  moves: string[];
  currentMoveIndex: number;
  isPlaying: boolean;
  onMoveComplete: (newIndex: number) => void;
  resetSignal: number;
  autoPlay: boolean;
}

function CubeScene({
  n,
  moves,
  currentMoveIndex,
  isPlaying,
  onMoveComplete,
  resetSignal,
  autoPlay,
}: CubeSceneProps) {
  const [cubies, setCubies] = useState<CubieState[]>(() =>
    createSolvedState(n),
  );
  const [animating, setAnimating] = useState(false);

  // Animation state refs
  const animGroupRef = useRef<THREE.Group>(null);
  const animDataRef = useRef<{
    axis: THREE.Vector3;
    totalAngle: number;
    rotated: number;
    speed: number;
    moveIdx: number;
    pendingCubies: CubieState[];
    affectedIds: Set<number>;
  } | null>(null);

  const prevResetRef = useRef(resetSignal);
  const prevNRef = useRef(n);

  // Reset cubies when n changes or reset signal fires
  useEffect(() => {
    if (prevNRef.current !== n || prevResetRef.current !== resetSignal) {
      setCubies(createSolvedState(n));
      setAnimating(false);
      animDataRef.current = null;
      prevNRef.current = n;
      prevResetRef.current = resetSignal;
    }
  }, [n, resetSignal]);

  // Start animating the current move
  useEffect(() => {
    if (!isPlaying && !autoPlay) return;
    if (animating) return;
    if (currentMoveIndex >= moves.length) return;

    const move = moves[currentMoveIndex];
    if (!move) return;

    const { axis, angle } = getRotationForMove(move);
    const affectedIndices = getCubiesForMove(cubies, move, n);
    const affectedIds = new Set(affectedIndices.map((i) => cubies[i].id));

    // Apply the move to get pending state
    const pendingCubies = applyMove(cubies, move, n);

    animDataRef.current = {
      axis,
      totalAngle: angle,
      rotated: 0,
      speed: Math.abs(angle) > Math.PI / 2 + 0.01 ? 5.5 : 4.5,
      moveIdx: currentMoveIndex,
      pendingCubies,
      affectedIds,
    };

    setAnimating(true);
  }, [currentMoveIndex, isPlaying, autoPlay, animating, cubies, moves, n]);

  useFrame((_, delta) => {
    if (!animating || !animDataRef.current || !animGroupRef.current) return;

    const data = animDataRef.current;
    const step = delta * data.speed;
    const remaining = data.totalAngle - data.rotated;
    const sign = data.totalAngle > 0 ? 1 : -1;
    const rotStep = sign * Math.min(Math.abs(step), Math.abs(remaining));

    // Rotate the animation group
    animGroupRef.current.rotateOnWorldAxis(data.axis, rotStep);
    data.rotated += rotStep;

    // Check if complete
    if (Math.abs(data.rotated) >= Math.abs(data.totalAngle) - 0.001) {
      // Snap and commit
      animGroupRef.current.rotation.set(0, 0, 0);
      setCubies(data.pendingCubies);
      setAnimating(false);
      animDataRef.current = null;
      onMoveComplete(data.moveIdx + 1);
    }
  });

  const cubieSize = 0.9;
  const gap = 0.05;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />

      <group>
        {/* Static cubies (not being animated) */}
        {cubies.map((cubie) => {
          if (animating && animDataRef.current?.affectedIds.has(cubie.id))
            return null;
          return (
            <Cubie
              key={cubie.id}
              cubie={cubie}
              cubieSize={cubieSize}
              gap={gap}
            />
          );
        })}

        {/* Animating cubies group */}
        {animating && animDataRef.current && (
          <group ref={animGroupRef}>
            {cubies
              .filter((c) => animDataRef.current?.affectedIds.has(c.id))
              .map((cubie) => (
                <Cubie
                  key={cubie.id}
                  cubie={cubie}
                  cubieSize={cubieSize}
                  gap={gap}
                />
              ))}
          </group>
        )}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={n * 1.5}
        maxDistance={n * 4}
        makeDefault
      />
      <Environment preset="studio" />
    </>
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────

interface RubiksCube3DProps {
  n: number;
  algorithm?: string;
  currentMoveIndex: number;
  isPlaying: boolean;
  onMoveComplete: (newIndex: number) => void;
  resetSignal: number;
  autoPlay?: boolean;
  className?: string;
}

export function RubiksCube3D({
  n,
  algorithm = "",
  currentMoveIndex,
  isPlaying,
  onMoveComplete,
  resetSignal,
  autoPlay = false,
  className = "",
}: RubiksCube3DProps) {
  const moves = parseMoves(algorithm);
  const camDistance = n * 2.4;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [camDistance, camDistance * 0.8, camDistance],
          fov: 45,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CubeScene
          n={n}
          moves={moves}
          currentMoveIndex={currentMoveIndex}
          isPlaying={isPlaying}
          onMoveComplete={onMoveComplete}
          resetSignal={resetSignal}
          autoPlay={autoPlay}
        />
      </Canvas>
    </div>
  );
}

// ─── Static (selector) cube ───────────────────────────────────────────────────

function StaticCubeScene({ n }: { n: number }) {
  const cubies = createSolvedState(n);
  const cubieSize = 0.9;
  const gap = 0.05;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -4]} intensity={0.25} />

      <group ref={groupRef} rotation={[0.3, 0.5, 0]}>
        {cubies.map((cubie) => (
          <Cubie key={cubie.id} cubie={cubie} cubieSize={cubieSize} gap={gap} />
        ))}
      </group>

      <OrbitControls enablePan={false} enableZoom={false} makeDefault />
      <Environment preset="studio" />
    </>
  );
}

export function StaticRubiksCube({
  n,
  className = "",
}: { n: number; className?: string }) {
  const camDistance = n * 2.4;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [camDistance, camDistance * 0.7, camDistance],
          fov: 45,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <StaticCubeScene n={n} />
      </Canvas>
    </div>
  );
}
