import styled from "styled-components"
import { controlMaxAtom, controlMinAtom, iMaxAtom, iMinAtom, kDAtom, kIAtom, kPAtom, samplingFrequencyAtom, tauAtom } from "../../logic/PIDSimulator"
import { AtomInput } from "./AtomInput"
import { ShrinkableHeightDiv, SpacingVertical } from "../Layout"
import { TitleBold } from "../Typography"

const Wrapper = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  ${SpacingVertical}
  border: solid 1px black;
  padding: 1rem;
  overflow: auto;
`

export const PIDInput = () => {
  
  return (
    <Wrapper spacing="0.5rem">
      <TitleBold>PID</TitleBold>
      <AtomInput atom={kPAtom} label='Kp'/>
      <AtomInput atom={kIAtom} label='Ki'/>
      <AtomInput atom={kDAtom} label='Kd'/>

      <AtomInput atom={samplingFrequencyAtom} label='Sampling Frequency (Hz)'/>

      <AtomInput atom={tauAtom} label='Tau'/>

      <AtomInput atom={controlMaxAtom} label='Control Max'/>
      <AtomInput atom={controlMinAtom} label='Control Min'/>

      <AtomInput atom={iMaxAtom} label='Integrator Max'/>
      <AtomInput atom={iMinAtom} label='Integrator Min'/>
    </Wrapper>
  );
};
