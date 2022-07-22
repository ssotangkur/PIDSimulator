import { atom, useAtomValue } from "jotai";
import { zip } from "lodash";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PIDConfig, PID } from "../../logic/PID";
import { controlMaxAtom, controlMinAtom, iMaxAtom, iMinAtom, kDAtom, kIAtom, kPAtom, outputsAtom, samplingDurationAtom, tauAtom } from "../../logic/PIDSimulator";
import { simulate } from "../../logic/Simulation";
import { setPointsAtom } from "../inputs/SetPointInput";
import { selectedSiumationAtom } from "../inputs/SimulationInput";
import { Dimensions } from "./Types";

export type SimulationDatum = {
  time: number,
  setPoint: number,
  measurement: number,
  control: number,
}

export type SimulationData = SimulationDatum[];

export const simulationOutput = atom((get) => {
  const simulation = get(selectedSiumationAtom);
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

export const chartData = atom(
  get => {
    const sp = get(setPointsAtom);
    const pv = get(simulationOutput);
    const samplingDuration = get(samplingDurationAtom);
    const pidData: SimulationData = zip(sp, pv).map(([sp, pv], i) => ({
      time: i * samplingDuration,
      setPoint: sp ?? 0,
      measurement: pv?.plantOutput.measurement ?? 0,
      control: pv?.pidOutput.control ?? 0,
    }));
    return pidData;
  }
);

export const SimulationChart = (props: {dimensions?: Dimensions}) => {

  const data = useAtomValue(chartData);

  return ( 
    <LineChart
      width={props.dimensions?.width}
      height={props.dimensions?.height}
      data={data}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      syncId='pid'
    >
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="time" />
      <YAxis/>
      <Line type="monotone" 
        dataKey="setPoint" 
        stroke="#ff7300"
        dot={false} />
      <Line
        type="monotone"
        dataKey="measurement"
        stroke="#387908"
        dot={false}
      />
    </LineChart>
  );
}
