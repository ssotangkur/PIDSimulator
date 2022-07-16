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

  controlMax: number,
  controlMin: number,

  iMax: number,
  iMin: number,
}

export type PIDState = {
  iPrev: number;
  errorPrev: number;

  measurementPrev: number;

  dPrev: number;
}

export type PIDOutput = ReturnType<typeof PID>;

export const initialState: PIDState = {
  iPrev: 0,
  errorPrev: 0,
  measurementPrev: 0,
  dPrev: 0,
}

export const PID = (
  {setPoint, measurement}: PIDInput, 
  {kP, kI, kD, samplingTime, tau, controlMax, controlMin, iMax, iMin}: PIDConfig, 
  {iPrev, errorPrev, measurementPrev, dPrev}: PIDState
) => {
  const error = setPoint - measurement;

  // Proportional term
  const p = kP * error;

  // Integrator term
  const iRaw = iPrev + 0.5 * kI * samplingTime * (error + errorPrev);
  
  // Clamp integrator to the limits
  const i = clamp(iRaw, iMin, iMax);

  // Derivative term
  const d = -(2 * kD * (measurement - measurementPrev) +
    (2 * tau - samplingTime) * dPrev) /
    (2 * tau + samplingTime);

  const controlRaw = p + i + d;

  const control = clamp(controlRaw, controlMin, controlMax);

  const state: PIDState = {
    iPrev: i,
    errorPrev: error,
    measurementPrev: measurement,
    dPrev: d,
  }

  return {
    control,
    controlRaw,
    p,
    i,
    iRaw,
    d,
    state,
  }
}