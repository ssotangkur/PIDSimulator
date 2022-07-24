import { atom } from "jotai";
import { cloneDeep } from "lodash";
import { massAtom } from "../components/inputs/SimulationInput";
import { setPointsAtom } from "../components/inputs/SetPointInput";
import { MassSystem, MassSystemConfig, MassSystemState, initialState as massSystemInitialState } from "./MassSystem";
import { initialState, PID, PIDConfig, PIDInput, PIDState } from "./PID";

export const samplingFrequencyAtom = atom(1); // in Hertz
export const samplingDurationAtom = atom(get => 1/get(samplingFrequencyAtom));

export const kPAtom = atom(0);
export const kIAtom = atom(0);
export const kDAtom = atom(0);


// export const kPAtom = atom(20);
// export const kIAtom = atom(5);
// export const kDAtom = atom(4);

export const tauAtom = atom(0.02);

export const controlMaxAtom = atom(1);
export const controlMinAtom = atom(0);

export const iMaxAtom = atom(5);
export const iMinAtom = atom(-5);

// export const outputsAtom = atom((get) => {
//   const config: PIDConfig = {
//     kP: get(kPAtom),
//     kI: get(kIAtom),
//     kD: get(kDAtom),

//     samplingTime: get(samplingDurationAtom),

//     tau: get(tauAtom),

//     controlMax: get(controlMaxAtom),
//     controlMin: get(controlMinAtom),

//     iMax: get(iMaxAtom),
//     iMin: get(iMinAtom),
//   };

//   let state: PIDState = cloneDeep(initialState);
  
//   const setPoints = get(setPointsAtom);
//   let massState: MassSystemState = cloneDeep(massSystemInitialState);

//   const measurements = setPoints.map(setPoint => {
//     const input: PIDInput = {
//       setPoint,
//       measurement: massState.position,
//     };

//     const output = PID(input, config, state);

//     const massConfig:MassSystemConfig = {
//       mass: get(massAtom), 
//       sampleTime: get(samplingDurationAtom),
//     };
    
//     const massOutput = MassSystem({force: output.control}, massConfig, massState);

//     state = output.state;
//     massState = massOutput;
//     return {
//       measurement: massOutput.position,
//       ...output,
//     }
//   });

//   return measurements;
// })