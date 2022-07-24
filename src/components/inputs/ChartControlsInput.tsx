import { atom } from "jotai";
import styled from "styled-components";
import { ShrinkableHeightDiv, SpacingVertical } from "../Layout";
import { TitleBold } from "../Typography";
import { AtomInput } from "./AtomInput";

const Wrapper = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  ${SpacingVertical}
  border: solid 1px black;
  padding: 1rem;
  overflow: auto;
`

export const updateRadiusAtom = atom(0);
export const setPointMinAtom = atom(0);
export const setPointMaxAtom = atom(300);

export const ChartControlsInput = () => {
  return (
    <Wrapper>
      <TitleBold>Chart Controls</TitleBold>
      <AtomInput atom={updateRadiusAtom} label="Update Radius" />
      <AtomInput atom={setPointMaxAtom} label="SetPoint Max" />
      <AtomInput atom={setPointMinAtom} label="SetPoint Min" />
    </Wrapper>
  )
}