import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TutorialStep {
    title: string;
    algorithm: string;
    description: string;
}
export type CubeType = string;
export interface backendInterface {
    addCubeType(cubeType: CubeType): Promise<void>;
    addTutorialStep(cubeType: CubeType, step: TutorialStep): Promise<void>;
    getAllCubeTypes(): Promise<Array<CubeType>>;
    getCubeType(cubeType: CubeType): Promise<Array<TutorialStep>>;
    getTutorialStep(cubeType: CubeType, stepIndex: bigint): Promise<TutorialStep>;
    removeCubeType(cubeType: CubeType): Promise<void>;
    removeTutorialStep(cubeType: CubeType, stepIndex: bigint): Promise<void>;
    searchByAlgorithm(algorithm: string): Promise<Array<[CubeType, TutorialStep]>>;
    swapTutorialSteps(cubeType: CubeType, index1: bigint, index2: bigint): Promise<void>;
    updateTutorialStep(cubeType: CubeType, stepIndex: bigint, newStep: TutorialStep): Promise<void>;
}
