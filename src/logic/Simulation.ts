import { atom, Atom, PrimitiveAtom } from "jotai";
import { cloneDeep } from "lodash";
import { setPointsAtom } from "../components/inputs/SetPointInput";
import { selectedSimulationAtom } from "../components/inputs/SimulationInput";
import { PIDOutput, PIDConfig, PIDState, initialState, PIDInput, PID } from "./PID";
import { kPAtom, kIAtom, kDAtom, samplingDurationAtom, tauAtom, controlMaxAtom, controlMinAtom, iMaxAtom, iMinAtom } from "./PIDSimulator";
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

export const simulationOutput = atom((get) => {
  const simulation = get(selectedSimulationAtom);
  const plantConfig = simulation.configSupplier(get);
  const initialState = simulation.initialStateSupplier(get);
  const pidConfig: PIDConfig = {
    kP: get(kPAtom),
    kI: get(kIAtom),
    kD: get(kDAtom),

    samplingTime: get(samplingDurationAtom),

    tau: get(tauAtom),

    controlMax: get(controlMaxAtom),
    controlMin: get(controlMinAtom),

    iMax: get(iMaxAtom),
    iMin: get(iMinAtom),
  };
  
  const output = simulate(simulation.plant, initialState, plantConfig, get(setPointsAtom), pidConfig);
  return output;
})