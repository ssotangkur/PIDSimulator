import { atom, useAtomValue, useSetAtom } from "jotai";
import { zip } from "lodash";
import React, { useCallback, useState } from "react";
import { CartesianGrid, Dot, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { samplingDurationAtom } from "../../logic/PIDSimulator";
import { simulationOutput } from "../../logic/Simulation";
import { updateRadiusAtom } from "../inputs/ChartControlsInput";
import { setPointsAtom } from "../inputs/SetPointInput";
import { Dimensions } from "./Types";

export type SimulationDatum = {
  time: number,
  setPoint: number,
  measurement: number,
  control: number,
}

export type SimulationData = SimulationDatum[];

const chartData = atom(
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


const ActiveDot = (props: any) => 
  <Dot 
    {...props} 
    onMouseDown={
      (e) => {
        console.log(e.cx);
      }
    }
    onMouseMove={
      (e) => {
        console.log(`Move: ${e.cx}`);
      }
    }
  />;

const getScale = (radius: number, selectedIndex: number, index: number) => {
  const indexDiff = Math.abs(selectedIndex - index);
  if (indexDiff === 0) return 1;
  if (radius === 0 || indexDiff > radius) { return 0; }
  return Math.pow(2, -Math.pow((indexDiff/(.55 * radius)), 2));
}

export const SimulationChart = (props: {dimensions?: Dimensions}) => {

  const data = useAtomValue(chartData);
  const radius = useAtomValue(updateRadiusAtom);
  const setSetPoints = useSetAtom(setPointsAtom);
  const [activeSetPointIndex, setActiveSetPointIndex] = useState<number>();

  const incrementSetPoint = (index:number, direction: 'up'|'down') => {
    setSetPoints((prev) => {
      const posRadius = Math.abs(radius);
      const min = Math.min(...prev);
      const max = Math.max(...prev);
      const range = max - min;
      const result = prev.map((val, i) => {
        const scale = getScale(posRadius, index, i);
        console.log(scale);
        const coeff = (direction === 'up' ? 0.05 : -0.05) * scale;
        const delta =  coeff * range;
        return val+=delta;
      });
      return result;
    });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if(activeSetPointIndex !== undefined) {
      const direction = e.deltaY < 0 ? 'up' : 'down';
      incrementSetPoint(activeSetPointIndex, direction);
    }
  }

  return (
    <div onWheel={(e) => {
      console.log({wheel: e});
      onWheel(e);
    }}> 
    <LineChart
      width={props.dimensions?.width}
      height={props.dimensions?.height}
      data={data}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      syncId='pid'
      onMouseMove={(e) => {
        setActiveSetPointIndex((prev) => {
          // only set if different
          if(prev !== e.activeTooltipIndex) {
            return e.activeTooltipIndex
          }
          return prev;
        });
      }}
      onClick={(e) => {
        console.log(e);
        setActiveSetPointIndex((prev) => {
          if(prev === undefined) {
            return e.activeTooltipIndex;
          }
          return undefined; // unset if clicked twice
        })
      }}
    >
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="time" />
      <YAxis/>
      <Line type="monotone" 
        dataKey="setPoint" 
        stroke="#ff7300"
        dot={false} 
        activeDot={ActiveDot}
        />
      <Line
        type="monotone"
        dataKey="measurement"
        stroke="#387908"
        dot={false}
      />
    </LineChart>
    </div>
  );
}
