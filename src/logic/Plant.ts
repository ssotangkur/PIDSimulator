

export type PlantOutput<State> = {
  measurement:  number,
  state: State
};
export type Plant<PlantConfig, State> = (config: PlantConfig, state: State, control?: number) => PlantOutput<State>;
