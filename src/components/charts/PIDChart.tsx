import { atom, useAtomValue } from "jotai";
import { LineChart, Tooltip, CartesianGrid, XAxis, YAxis, Line, ReferenceLine } from "recharts";
import { iMaxAtom, iMinAtom, samplingDurationAtom } from "../../logic/PIDSimulator";
import { simulationOutput } from "../../logic/Simulation";
import { Dimensions } from "./Types";

const chartData = atom(
  get => {
    const outputs = get(simulationOutput);
    const samplingDuration = get(samplingDurationAtom);
    const pidData = outputs.map((output, i) => ({
      time: i * samplingDuration,
      ...output.pidOutput,
    }));
    return pidData;
  }
);

export const PIDChart = (props: {dimensions?: Dimensions}) => {

  const data = useAtomValue(chartData);
  const iMin = useAtomValue(iMinAtom);
  const iMax = useAtomValue(iMaxAtom);

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
        <Line
        type="monotone"
        dataKey="p"
        stroke="#1b0879"
        dot={false}
      />
        <Line
        type="monotone"
        dataKey="i"
        stroke="#940f7e"
        dot={false}
      />
        <Line
        type="monotone"
        dataKey="d"
        stroke="#2c7908"
        dot={false}
      />
        <Line
        type="monotone"
        dataKey="iRaw"
        stroke="#794608"
        dot={false}
      />
      <ReferenceLine y={iMin} stroke="grey" strokeDasharray="3 3" label="iMin" />
      <ReferenceLine y={iMax} stroke="grey" strokeDasharray="3 3" label="iMax" />
    </LineChart>
  );
}