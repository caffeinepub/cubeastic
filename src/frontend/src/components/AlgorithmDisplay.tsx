import { parseMoves } from "../utils/cubeEngine";

interface AlgorithmDisplayProps {
  algorithm: string;
  currentMoveIndex: number;
}

export function AlgorithmDisplay({
  algorithm,
  currentMoveIndex,
}: AlgorithmDisplayProps) {
  const moves = parseMoves(algorithm);

  if (moves.length === 0) {
    return (
      <div className="text-muted-foreground font-mono text-sm italic">
        No algorithm
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {moves.map((move, i) => {
        let className = "move-token";
        if (i === currentMoveIndex) {
          className += " active";
        } else if (i < currentMoveIndex) {
          className += " completed";
        }
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: move index is stable for fixed algorithm
          <span key={i} className={className}>
            {move}
          </span>
        );
      })}
    </div>
  );
}
