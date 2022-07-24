import { atom, useAtomValue } from "jotai";
import { LineChart, Tooltip, CartesianGrid, XAxis, YAxis, Line, ReferenceLine } from "recharts";
import { controlMaxAtom, controlMinAtom, samplingDurationAtom } from "../../logic/PIDSimulator";
import { simulationOutput } from "../../logic/Simulation";
import { Dimensions } from "./Types";

const chartData = atom(
  get => {
    const pvs = get(simulationOutput);
    const samplingDuration = get(samplingDurationAtom);
    const controlData = pvs.map((pv, i) => ({
      time: i * samplingDuration,
      control: pv?.pidOutput.control ?? 0,
    }));
    return controlData;
  }
);

export const ControlChart = (props: {dimensions?: Dimensions}) => {

  const data = useAtomValue(chartData);
  const controlMax = useAtomValue(controlMaxAtom);
  const controlMin = useAtomValue(controlMinAtom);

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
        dataKey="control"
        stroke="#791908"
        dot={false}
      />
        <ReferenceLine y={0} stroke="blue" />
        <ReferenceLine y={controlMax} stroke="red" strokeDasharray="3 3" label="Control Max" />
        <ReferenceLine y={controlMin} stroke="red" strokeDasharray="3 3" label="Control Min" />
    </LineChart>
  );
}