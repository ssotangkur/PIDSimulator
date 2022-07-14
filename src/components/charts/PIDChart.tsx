import { atom, useAtomValue } from "jotai";
import { ResponsiveContainer, LineChart, Tooltip, CartesianGrid, XAxis, YAxis, Line, ReferenceLine } from "recharts";
import { outputsAtom, samplingDurationAtom } from "../../logic/PIDSimulator";

const chartData = atom(
  get => {
    const outputs = get(outputsAtom);
    const samplingDuration = get(samplingDurationAtom);
    const pidData = outputs.map((output, i) => ({
      time: i * samplingDuration,
      ...output,
    }));
    return pidData;
  }
);

export const PIDChart = () => {

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
      </LineChart>
    </ResponsiveContainer>
  );
}