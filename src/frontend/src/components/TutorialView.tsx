import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { type CubeSize, TUTORIALS } from "../data/tutorialData";
import { parseMoves } from "../utils/cubeEngine";
import { AlgorithmDisplay } from "./AlgorithmDisplay";
import { RubiksCube3D } from "./RubiksCube3D";

interface TutorialViewProps {
  cubeSize: CubeSize;
  onBack: () => void;
}

export function TutorialView({ cubeSize, onBack }: TutorialViewProps) {
  const tutorial = TUTORIALS[cubeSize];
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const step = tutorial.steps[currentStep];
  const moves = parseMoves(step.algorithm);
  const totalSteps = tutorial.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleMoveComplete = useCallback(
    (newIndex: number) => {
      if (newIndex >= moves.length) {
        setIsPlaying(false);
        setCurrentMoveIndex(moves.length);
      } else {
        setCurrentMoveIndex(newIndex);
      }
    },
    [moves.length],
  );

  const handlePlayPause = () => {
    if (currentMoveIndex >= moves.length) {
      // Restart
      setResetSignal((s) => s + 1);
      setCurrentMoveIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleNextMove = () => {
    if (isPlaying) setIsPlaying(false);
    if (currentMoveIndex < moves.length) {
      setCurrentMoveIndex((i) => i + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    setResetSignal((s) => s + 1);
  };

  const goToStep = (newStep: number) => {
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    setResetSignal((s) => s + 1);
    setCurrentStep(newStep);
    setShowTip(false);
  };

  const isComplete = currentMoveIndex >= moves.length && moves.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-body text-sm">Back to Selector</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-foreground">
              {tutorial.label} Tutorial
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left: Tutorial content */}
          <div className="flex flex-col gap-4">
            {/* Step navigation tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {tutorial.steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => goToStep(i)}
                  className={`flex-shrink-0 px-3 py-2 rounded-md text-xs font-body font-medium transition-all flex flex-col items-start gap-0.5 min-w-[80px] max-w-[110px] ${
                    i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : i < currentStep
                        ? "bg-accent/20 text-accent"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">
                    Step {i + 1}
                  </span>
                  <span className="truncate w-full text-left">{s.title}</span>
                </button>
              ))}
            </div>

            {/* Step content card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="card-glass rounded-xl p-5 flex flex-col gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                      Step {currentStep + 1}
                    </span>
                    {isComplete && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-mono">
                        ✓ Complete
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl text-foreground leading-tight">
                    {step.title}
                  </h2>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Tip */}
                {step.tip && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowTip((v) => !v)}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-body"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showTip ? "Hide tip" : "Show tip"}
                    </button>
                    <AnimatePresence>
                      {showTip && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs font-body text-foreground leading-relaxed">
                            💡 {step.tip}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Algorithm display */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Algorithm
                  </span>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <AlgorithmDisplay
                      algorithm={step.algorithm}
                      currentMoveIndex={currentMoveIndex}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">
                      {currentMoveIndex}/{moves.length} moves
                    </span>
                    <span className="font-body">{step.algorithm}</span>
                  </div>
                </div>

                {/* Playback controls */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePlayPause}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Pause
                      </>
                    ) : isComplete ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        Replay
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Play
                      </>
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleNextMove}
                    disabled={isComplete || isPlaying}
                    className="gap-2"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Next Move
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step navigation */}
            <div className="flex justify-between mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === totalSteps - 1}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: 3D Cube */}
          <div className="flex flex-col gap-3">
            <div
              className="card-glass rounded-xl overflow-hidden"
              style={{ height: "480px" }}
            >
              <RubiksCube3D
                n={tutorial.dimension}
                algorithm={step.algorithm}
                currentMoveIndex={currentMoveIndex}
                isPlaying={isPlaying}
                onMoveComplete={handleMoveComplete}
                resetSignal={resetSignal}
                autoPlay={isPlaying}
                className="w-full h-full"
              />
            </div>

            <div className="card-glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-body text-center">
                Drag to rotate the cube · Scroll to zoom · Watch the algorithm
                animate in real time
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
