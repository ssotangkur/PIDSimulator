import { useAtom } from "jotai";
import { useState } from "react";
import { kPAtom } from "../../logic/PIDSimulator";
import { BodyRegular } from "../Typography";
import { ShortInput } from "../Widgets";
import { RowSpaceBetween } from "./PIDInput";

export const AtomInput = ({ label, atom }: { label: string; atom: typeof kPAtom; }) => {
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
