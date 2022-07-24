import { dirxml } from "console";
import { atom, useAtomValue, useAtom } from "jotai";
import { map } from "lodash";
import styled from "styled-components";
import { MassSystemConfig, massSystemPlant, MassSystemState } from "../../logic/MassSystem"
import { samplingDurationAtom } from "../../logic/PIDSimulator";
import { SimulationConfig, UIConfig } from "../../logic/Simulation"
import { ThermalConfig, thermalPlant, ThermalState, thermalSystemSimulation } from "../../logic/ThermalSystem";
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

export const simulations: SimulationConfig<any, any>[] = [
  massSystemSimulation,
  thermalSystemSimulation,
];

export const selectedSimulationAtom = atom<SimulationConfig<any, any>>(thermalSystemSimulation);

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
  const [selectedSimulation, setSelectedSimulation] = useAtom(selectedSimulationAtom);

  const options: DropDownOption[] = simulations.map((sim, index) => ({
    label: sim.uiConfig.title,
    onSelected: () => {
      setSelectedSimulation(simulations[index])
    },
  }));

  const selectedOptionIndex = simulations.findIndex((sim) => sim === selectedSimulation);
  const selectedOption = options[selectedOptionIndex];

  return (
   <DropDown options={options} selected={selectedOption}/>
  )
}

export const SimulationInput = () => {
  const selectedSimulation = useAtomValue(selectedSimulationAtom);

  return (
    <Wrapper>
      <PlantSelector/>
      <PlantInput uiConfig={selectedSimulation.uiConfig} />
    </Wrapper>
  )
}