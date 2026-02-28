import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type TutorialStep = {
    title : Text;
    description : Text;
    algorithm : Text;
  };

  type CubeType = Text;

  let tutorialStepsMap = Map.empty<CubeType, [TutorialStep]>();

  public shared ({ caller }) func addCubeType(cubeType : CubeType) : async () {
    if (tutorialStepsMap.containsKey(cubeType)) {
      Runtime.trap("Cube type already exists");
    } else {
      tutorialStepsMap.add(cubeType, []);
    };
  };

  public shared ({ caller }) func addTutorialStep(cubeType : CubeType, step : TutorialStep) : async () {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) {
        let newSteps = steps.concat([step]);
        tutorialStepsMap.add(cubeType, newSteps);
      };
    };
  };

  public query ({ caller }) func getAllCubeTypes() : async [CubeType] {
    tutorialStepsMap.keys().toArray();
  };

  public shared ({ caller }) func getCubeType(cubeType : CubeType) : async [TutorialStep] {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) { steps };
    };
  };

  public shared ({ caller }) func getTutorialStep(cubeType : CubeType, stepIndex : Nat) : async TutorialStep {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) {
        if (stepIndex >= steps.size()) {
          Runtime.trap("Step index out of bounds");
        };
        steps[stepIndex];
      };
    };
  };

  public shared ({ caller }) func updateTutorialStep(cubeType : CubeType, stepIndex : Nat, newStep : TutorialStep) : async () {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) {
        if (stepIndex >= steps.size()) {
          Runtime.trap("Step index out of bounds");
        };
        let mutableSteps = steps.toVarArray<TutorialStep>();
        mutableSteps[stepIndex] := newStep;
        tutorialStepsMap.add(cubeType, mutableSteps.toArray());
      };
    };
  };

  public shared ({ caller }) func removeTutorialStep(cubeType : CubeType, stepIndex : Nat) : async () {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) {
        let size = steps.size();
        if (stepIndex >= size) {
          Runtime.trap("Step index out of bounds");
        } else if (size == 1) {
          tutorialStepsMap.add(cubeType, []);
        } else if (stepIndex == 0) {
          tutorialStepsMap.add(cubeType, steps.sliceToArray(1, size));
        } else if (stepIndex == size - 1) {
          tutorialStepsMap.add(cubeType, steps.sliceToArray(0, size - 1));
        } else {
          let firstPart = steps.sliceToArray(0, stepIndex);
          let secondPart = steps.sliceToArray(stepIndex + 1, size);
          tutorialStepsMap.add(cubeType, firstPart.concat(secondPart));
        };
      };
    };
  };

  public shared ({ caller }) func removeCubeType(cubeType : CubeType) : async () {
    if (tutorialStepsMap.containsKey(cubeType)) {
      tutorialStepsMap.remove(cubeType);
    } else {
      Runtime.trap("Cube type not found");
    };
  };

  public shared ({ caller }) func swapTutorialSteps(cubeType : CubeType, index1 : Nat, index2 : Nat) : async () {
    switch (tutorialStepsMap.get(cubeType)) {
      case (null) { Runtime.trap("Cube type not found") };
      case (?steps) {
        let size = steps.size();
        if (index1 >= size or index2 >= size) {
          Runtime.trap("Step index out of bounds");
        };

        let mutableSteps = steps.toVarArray<TutorialStep>();
        let temp = mutableSteps[index1];
        mutableSteps[index1] := mutableSteps[index2];
        mutableSteps[index2] := temp;
        tutorialStepsMap.add(cubeType, mutableSteps.toArray());
      };
    };
  };

  public query ({ caller }) func searchByAlgorithm(algorithm : Text) : async [(CubeType, TutorialStep)] {
    var matches = ([] : [(CubeType, TutorialStep)]);
    for ((cubeType, steps) in tutorialStepsMap.entries()) {
      for (step in steps.values()) {
        if (step.algorithm.contains(#text(algorithm))) {
          matches := matches.concat([(cubeType, step)]);
        };
      };
    };
    matches;
  };
};
