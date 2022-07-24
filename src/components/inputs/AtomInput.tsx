import { PrimitiveAtom, useAtom } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Row } from "../Layout";
import { BodyRegular } from "../Typography";
import { ShortInput } from "../Widgets";

export const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
`

export const AtomInput = ({ label, atom }: { label: string; atom: PrimitiveAtom<number> }) => {
  const [atomValue, setAtomValue] = useAtom(atom);
  const [valueString, setValueString] = useState(`${atomValue}`);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueString(e.target.value);
    const value = parseFloat(e.target.value);
    if (isNaN(value)) { return; }
    setAtomValue(value);
  };

  return (
    <RowSpaceBetween spacing="0.5rem">
      <div><BodyRegular>{`${label}:`}</BodyRegular></div>
      <ShortInput onChange={onChange} value={valueString} type="number"></ShortInput>
    </RowSpaceBetween>
  );
};
