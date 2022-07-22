import { Atom, PrimitiveAtom } from "jotai";
import { cloneDeep } from "lodash";
import { PIDOutput, PIDConfig, PIDState, initialState, PIDInput, PID } from "./PID";
import { PlantOutput, Plant } from "./Plant";

export type SimulationOutput<S> = {
  pidOutput: PIDOutput,
  plantOutput: PlantOutput<S>,
}

export const simulate = <P, S>(
  plant: Plant<P,S>,
  initialPlantState: S,
  plantConfig: P,
  setPoints: number[],
  pidConfig: PIDConfig,
): SimulationOutput<S>[] => {

  // Calculate initial measurement from plant
  const plantState = cloneDeep(initialPlantState);
  const initialPlantOutput = plant(plantConfig, plantState);
  let prevMeasurement = initialPlantOutput.measurement;
  const pidState: PIDState = cloneDeep(initialState);

  const { outputs } = setPoints.reduce(({prevMeasurement, pidState, plantState, outputs}, setPoint) => {
    const pidInput: PIDInput = {
      setPoint,
      measurement: prevMeasurement,
    };

    const pidOutput = PID(pidInput, pidConfig, pidState);
    const plantOutput: PlantOutput<S> = plant(plantConfig, plantState, pidOutput.control);

    outputs.push({
      plantOutput,
      pidOutput,
    });

    return {
      prevMeasurement: plantOutput.measurement,
      pidState: pidOutput.state,
      plantState: plantOutput.state,
      outputs,
    }
  }, {prevMeasurement, pidState, plantState, outputs: [] as SimulationOutput<S>[]});
  
  return outputs;
};

export type InputAtom = {
  label: string,
  atom: PrimitiveAtom<number>,
}

export type UIConfig = {
  title: string,
  inputAtoms: InputAtom[],
}

export type SimulationConfig<Config, State> = {
  plant: Plant<Config, State>,
  uiConfig: UIConfig,
  configSupplier: (get: (atom: Atom<number>) => number) => Config,
  initialStateSupplier: (get: (atom: Atom<number>) => number) => State,
}