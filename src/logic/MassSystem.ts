import { Plant } from "./Plant"

export type MassSystemConfig = {
  mass: number,
  sampleTime: number, // seconds
}

export type MassSystemState = {
  position: number,
  velocity: number,
}

export type MassSystemInput = {
  force: number,
}

export const initialState: MassSystemState = {
  position: 0,
  velocity: 0,
}

export const MassSystem = (
  {force}: MassSystemInput,
  {mass, sampleTime}: MassSystemConfig,
  {position, velocity}: MassSystemState
): MassSystemState => {
  // F = ma --> a = m/F
  const a = force ? force / mass : 0;
  const deltaV = a * sampleTime;

  const newVelocity = velocity + deltaV;
  const newPosition = position + (newVelocity * sampleTime);

  return {
    velocity: newVelocity,
    position: newPosition,
  }
}

export type MassSystemPlant = Plant<MassSystemConfig, MassSystemState>;
  
export const massSystemPlant: MassSystemPlant = ({mass, sampleTime}, {velocity, position}, control) => {
  // When there's no control applied treat as force == 0
  const force = control ?? 0;
  // F = ma --> a = F/m
  const a = force / mass;
  const deltaV = a * sampleTime;

  const newVelocity = velocity + deltaV;
  const newPosition = position + (newVelocity * sampleTime);

  return {
    state: {
      velocity: newVelocity,
      position: newPosition,
    },
    measurement: newPosition,
  };
};

// export const MassSimulation = simulate(massSystemPlant, initialState, {});