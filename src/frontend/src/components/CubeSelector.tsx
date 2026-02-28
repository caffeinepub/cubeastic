import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Layers, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type CubeSize, CubeTutorial, TUTORIALS } from "../data/tutorialData";
import { StaticRubiksCube } from "./RubiksCube3D";

const CUBE_ORDER: CubeSize[] = ["2x2", "3x3", "4x4", "5x5", "6x6"];

const DIFFICULTY = {
  "2x2": { label: "Beginner", stars: 1, color: "text-cube-orange" },
  "3x3": { label: "Intermediate", stars: 2, color: "text-cube-yellow" },
  "4x4": { label: "Advanced", stars: 3, color: "text-cube-green" },
  "5x5": { label: "Expert", stars: 4, color: "text-cube-blue" },
  "6x6": { label: "Master", stars: 5, color: "text-accent" },
};

interface CubeSelectorProps {
  onStartLearning: (size: CubeSize) => void;
}

export function CubeSelector({ onStartLearning }: CubeSelectorProps) {
  const [selected, setSelected] = useState<CubeSize>("3x3");

  const tutorial = TUTORIALS[selected];
  const diff = DIFFICULTY[selected];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero header */}
      <header className="pt-12 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary font-semibold tracking-wider uppercase">
                Interactive 3D Tutorials
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-glow">
              Cube Solver
              <br />
              <span className="text-primary">Tutor</span>
            </h1>

            <p className="mt-4 font-body text-lg text-muted-foreground max-w-xl mx-auto">
              Master any Rubik&rsquo;s cube with step-by-step guidance and live
              3D algorithm animations.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Cube type selector */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider text-center mb-4">
              Choose your cube
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {CUBE_ORDER.map((size, i) => {
                const t = TUTORIALS[size];
                const isSelected = selected === size;
                return (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    onClick={() => setSelected(size)}
                    className={`cube-selector-btn relative px-5 py-3 rounded-xl font-body font-semibold text-base transition-all ${
                      isSelected
                        ? "selected bg-primary/20 text-primary border border-primary/60 shadow-lg border-glow"
                        : "bg-card text-foreground border border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <span className="relative z-10">{t.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content: 3D cube + info */}
      <section className="flex-1 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              {/* 3D cube display */}
              <div
                className="card-glass rounded-2xl overflow-hidden"
                style={{ height: "360px" }}
              >
                <StaticRubiksCube
                  n={tutorial.dimension}
                  className="w-full h-full"
                />
              </div>

              {/* Info panel */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-display text-3xl text-foreground">
                      {tutorial.label} Cube
                    </h2>
                    <span
                      className={`flex items-center gap-0.5 text-sm ${diff.color}`}
                    >
                      {Array.from({ length: diff.stars }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static star rating display
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-primary font-medium">
                    {diff.label}
                  </p>
                  <p className="mt-2 font-body text-muted-foreground leading-relaxed">
                    {tutorial.tagline}
                  </p>
                </div>

                {/* Steps overview */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {tutorial.steps.length} learning steps
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {tutorial.steps.map((step, i) => (
                      <div
                        key={step.title}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/60 border border-border group hover:border-primary/30 transition-colors"
                      >
                        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-mono font-bold">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-foreground truncate">
                            {step.title}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground truncate">
                            {step.algorithm}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <Button
                  size="lg"
                  onClick={() => onStartLearning(selected)}
                  className="gap-2 font-body font-semibold text-base w-full"
                >
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50 mt-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
