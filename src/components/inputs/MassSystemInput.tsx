import styled from "styled-components"
import { ShrinkableHeightDiv, SpacingVertical } from "../Layout"
import { TitleBold } from "../Typography"
import { AtomInput } from "./AtomInput"
import { massAtom } from "./SimulationInput"

const Wrapper = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  ${SpacingVertical}
  border: solid 1px black;
  padding: 1rem;
  overflow: auto;
`

export const MassSystemInput = () => {
  return (
    <Wrapper>
      <TitleBold>Mass System</TitleBold>
      <AtomInput atom={massAtom} label="Mass (kg)"/>
    </Wrapper>
  )
}