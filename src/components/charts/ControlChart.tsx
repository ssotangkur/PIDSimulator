import { atom, useAtomValue } from "jotai";
import { ResponsiveContainer, LineChart, Tooltip, CartesianGrid, XAxis, YAxis, Line, ReferenceLine } from "recharts";
import { outputsAtom, samplingDurationAtom } from "../../logic/PIDSimulator";

const chartData = atom(
  get => {
    const pvs = get(outputsAtom);
    const samplingDuration = get(samplingDurationAtom);
    const controlData = pvs.map((pv, i) => ({
      time: i * samplingDuration,
      control: pv?.control ?? 0,
    }));
    return controlData;
  }
);

export const ControlChart = () => {

  const data = useAtomValue(chartData);

  return ( 
    <ResponsiveContainer>
      <LineChart
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
      </LineChart>
    </ResponsiveContainer>
  );
}