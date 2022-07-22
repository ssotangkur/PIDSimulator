import { dirxml } from "console";
import { atom, useSetAtom, useAtomValue } from "jotai";
import { map } from "lodash";
import styled from "styled-components";
import { MassSystemConfig, massSystemPlant, MassSystemState } from "../../logic/MassSystem"
import { samplingDurationAtom } from "../../logic/PIDSimulator";
import { SimulationConfig, UIConfig } from "../../logic/Simulation"
import { ThermalConfig, thermalPlant, ThermalState } from "../../logic/ThermalSystem";
import { ShrinkableHeightDiv, SpacingVertical } from "../Layout";
import { TitleBold } from "../Typography";
import { DropDown, DropDownOption } from "../Widgets";
import { AtomInput } from "./AtomInput";

export const massAtom = atom(1);

export const massSystemSimulation: SimulationConfig<MassSystemConfig, MassSystemState> = {
  plant: massSystemPlant,
  uiConfig: {
    title: "Mass System",
    inputAtoms: [
      {
        atom: massAtom,
        label: "Mass (kg)"
      }
    ]
  },
  configSupplier: (get) => {
    return {
      mass: get(massAtom),
      sampleTime: get(samplingDurationAtom),
    }
  },
  initialStateSupplier: (get) => ({
    position: 0,
    velocity: 0,
  }),
}

const heaterPowerAtom = atom(750);
const heatTransferCoeffAtom = atom(2.5);
const areaAtom = atom(0.3 * 0.3);
const roomTempAtom = atom(20);
const specificHeatAtom = atom(0.897);
const thermalMassAtom = atom(1215); // density(Al) = 2700000g/m3 * 0.3m * 0.3m * 0.005m =  1215g

export const thermalSystemSimulation: SimulationConfig<ThermalConfig, ThermalState> = {
  plant: thermalPlant,
  uiConfig: {
    title: "Heated Bed System",
    inputAtoms: [
      {
        label: "Heater Power (Watts)",
        atom: heaterPowerAtom,
      },
      {
        label: "Heat Transfer Coeff (Watts/(m^2*C))",
        atom: heatTransferCoeffAtom,
      },
      {
        label: "Area (m^2)",
        atom: areaAtom,
      },
      {
        label: "Room Temp (C)",
        atom: roomTempAtom,
      },
      {
        label: "Specific Heat (Joule/(g * C))",
        atom: specificHeatAtom,
      },
      {
        label: "Mass (g)",
        atom: thermalMassAtom,
      },
    ]
  },
  configSupplier: (get) => {
    return {
      heaterPower: get(heaterPowerAtom),
      heatTransferCoeff: get(heatTransferCoeffAtom),
      area: get(areaAtom),
      roomTemperature: get(roomTempAtom),
      specificHeatCoeff: get(specificHeatAtom),
      mass: get(thermalMassAtom),
      samplingDuration: get(samplingDurationAtom),
    }
  },
  initialStateSupplier: (get) => ({
    prevTemp: get(roomTempAtom),
  }),
}

export const simulations: SimulationConfig<any, any>[] = [
  massSystemSimulation,
  thermalSystemSimulation,
];

export const selectedSimulationIndexAtom = atom(0);
export const selectedSiumationAtom = atom<SimulationConfig<any, any>>(massSystemSimulation);

const InputWrapper = styled(ShrinkableHeightDiv)`
   flex-direction: column;
  ${SpacingVertical}
`;

const Wrapper = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  ${SpacingVertical}
  border: solid 1px black;
  padding: 1rem;
  overflow: auto;
`

const PlantInput = ({uiConfig}: {uiConfig: UIConfig}) => {
  return (
    <InputWrapper>
      <TitleBold>{uiConfig.title}</TitleBold>
      <>
        {uiConfig.inputAtoms.map(({atom, label}) => 
          <AtomInput atom={atom} label={label} key={label}/>
        )}
      </>
    </InputWrapper>
  )
}

export const PlantSelector = () => {
  const setSelectedSimulation = useSetAtom(selectedSiumationAtom);

  const options: DropDownOption[] = simulations.map((sim, index) => ({
    label: sim.uiConfig.title,
    onSelected: () => setSelectedSimulation(simulations[index]),
  }));

  return (
   <DropDown options={options}/>
  )
}

export const SimulationInput = () => {
  const selectedSimulation = useAtomValue(selectedSiumationAtom);

  return (
    <Wrapper>
      <PlantSelector/>
      <PlantInput uiConfig={selectedSimulation.uiConfig} />
    </Wrapper>
  )
}