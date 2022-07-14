import { useAtom } from "jotai"
import { useState } from "react"
import styled from "styled-components"
import { kDAtom, kIAtom, kPAtom, samplingFrequencyAtom, tauAtom } from "../logic/PIDSimulator"
import { Row, ShrinkableHeightDiv, SpacingHorizontal, SpacingVertical } from "./Layout"
import { BodyRegular, TitleBold } from "./Typography"
import { ShortInput } from "./Widgets"

const Wrapper = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  ${SpacingVertical}
  border: solid 1px black;
  padding: 1rem;
`

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
`

const AtomInput = ({label, atom}: {label: string, atom: typeof kPAtom}) => {
  const [atomValue, setAtomValue] = useAtom(atom);
  const [valueString, setValueString] = useState(`${atomValue}`);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueString(e.target.value);
    const value = parseInt(e.target.value);
    if(isNaN(value)) { return; }
    setAtomValue(value);
  }

  return (
    <RowSpaceBetween spacing="0.5rem">
      <div><BodyRegular>{`${label}:`}</BodyRegular></div>
      <ShortInput onChange={onChange} value={valueString}></ShortInput>
    </RowSpaceBetween>
  );
}

export const PIDInput = () => {
  
  return (
    <Wrapper spacing="0.5rem">
      <TitleBold>PID</TitleBold>
      <AtomInput atom={kPAtom} label='Kp'/>
      <AtomInput atom={kIAtom} label='Ki'/>
      <AtomInput atom={kDAtom} label='Kd'/>

      <AtomInput atom={samplingFrequencyAtom} label='Sampling Frequency (Hz)'/>

      <AtomInput atom={tauAtom} label='Tau'/>
      {/* <Row>
        <BodyRegular>Kp:</BodyRegular>
        <input onChange={(e) => setAtom(e, setKp)}></input>
      </Row>
      <Row>
        <BodyRegular>Ki:</BodyRegular>

        <input onChange={(e) => setAtom(e, setKi)}></input>
      </Row>
      <Row>
        <BodyRegular>Kd:</BodyRegular>
        <input onChange={(e) => setAtom(e, setKd)}></input>
      </Row> */}
    </Wrapper>
  );
};
