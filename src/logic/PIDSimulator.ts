import { atom } from "jotai";
import { cloneDeep } from "lodash";
import { setPointsAtom } from "../components/SetPointInput";
import { MassSystem, MassSystemConfig, MassSystemState, initialState as massSystemInitialState } from "./MassSystem";
import { initialState, PID, PIDConfig, PIDInput, PIDState } from "./PID";

export const samplingFrequencyAtom = atom(2); // in Hertz
export const samplingDurationAtom = atom(get => 1/get(samplingFrequencyAtom));

export const kPAtom = atom(-4);
export const kIAtom = atom(0);
export const kDAtom = atom(-12);

export const tauAtom = atom(1);

export const controlMaxAtom = atom(1000);
export const controlMinAtom = atom(-1000);

export const iMaxAtom = atom(200);
export const iMinAtom = atom(-200);

export const outputsAtom = atom((get) => {
  const config: PIDConfig = {
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

  let state: PIDState = cloneDeep(initialState);
  
  const setPoints = get(setPointsAtom);
  let massState: MassSystemState = cloneDeep(massSystemInitialState);

  const measurements = setPoints.map(setPoint => {
    const input: PIDInput = {
      setPoint,
      measurement: massState.position,
    };

    const output = PID(input, config, state);

    const massConfig:MassSystemConfig = {
      mass: 10, 
      sampleTime: get(samplingDurationAtom),
    };
    
    const massOutput = MassSystem({force: output.control}, massConfig, massState);

    state = output.state;
    massState = massOutput;
    return {
      measurement: massOutput.position,
      ...output,
    }
  });

  return measurements;
})