import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CubeSelector } from "./components/CubeSelector";
import { TutorialView } from "./components/TutorialView";
import type { CubeSize } from "./data/tutorialData";

type AppView = "selector" | "tutorial";

export default function App() {
  const [view, setView] = useState<AppView>("selector");
  const [selectedCube, setSelectedCube] = useState<CubeSize>("3x3");

  const handleStartLearning = (size: CubeSize) => {
    setSelectedCube(size);
    setView("tutorial");
  };

  const handleBack = () => {
    setView("selector");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "selector" ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CubeSelector onStartLearning={handleStartLearning} />
          </motion.div>
        ) : (
          <motion.div
            key="tutorial"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <TutorialView cubeSize={selectedCube} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
