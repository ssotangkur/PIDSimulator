import { clamp } from "lodash";

export type PIDInput = {
  setPoint: number,
  measurement: number,
}

export type PIDConfig = {
  kP: number,
  kI: number, 
  kD: number,

  samplingTime: number,

  tau: number,

  limitMax: number;
  limitMin: number;
}

export type PIDState = {
  iPrev: number;
  errorPrev: number;

  measurementPrev: number;

  dPrev: number;
}

// export type PIDOutput = {
//   control: number,
//   state: PIDState,
// }
export type PIDOutput = ReturnType<typeof PID>;

export const initialState: PIDState = {
  iPrev: 0,
  errorPrev: 0,
  measurementPrev: 0,
  dPrev: 0,
}

export const PID = (
  {setPoint, measurement}: PIDInput, 
  {kP, kI, kD, samplingTime, tau, limitMax, limitMin}: PIDConfig, 
  {iPrev, errorPrev, measurementPrev, dPrev}: PIDState
) => {
  const error = measurement - setPoint;

  // Proportional term
  const p = kP * error;

  // Integrator term
  const iRaw = iPrev + 0.5 * kI * samplingTime * (error + errorPrev);
  
  // Compute integrator limits
  const limitMaxInternal = limitMax > p ? limitMax - p : 0;
  const limitMinInternal = limitMin < p ? limitMin - p : 0;

  // Clamp integrator to the limits
  const i = clamp(iRaw, limitMinInternal, limitMaxInternal);

  // Derivative term
  const d = (2 * kD * (measurement - measurementPrev) +
    (2 * tau - samplingTime) * dPrev) /
    (2 * tau + samplingTime);

  const control = p + i + d;

  const state: PIDState = {
    iPrev: i,
    errorPrev: error,
    measurementPrev: measurement,
    dPrev: d,
  }

  return {
    control,
    p,
    i,
    iRaw,
    d,
    state,
  }
}