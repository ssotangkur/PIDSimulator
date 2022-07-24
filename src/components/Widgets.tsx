import { useState } from "react";
import styled from "styled-components";


export const ShortInput = styled.input<{invalid?: boolean}>`
  width: 4rem;
  text-align: end;
  ${props => props.invalid && 'border: solid 2px red;' }
  ${props => props.invalid && 'outline: solid 2px red;' }
`

export type DropDownOption = {
  label: string,
  onSelected: () => void,
}
export type DropDownProps = {
  options: DropDownOption[],
  selected?: DropDownOption,
}

const getSelectedIndexOptionally = (options: DropDownOption[], selected?: DropDownOption) => {
  const selectedIndexOrNeg1 = options.findIndex((option) => option === selected);
  const selectedIndex = selectedIndexOrNeg1 === -1 ? undefined : selectedIndexOrNeg1;
  return selectedIndex;
}

export const DropDown = ({options, selected}: DropDownProps) => {

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if(value) {
      const optionIndex = parseInt(value);
      options[optionIndex].onSelected();
    }
  }

  const selectedIndex = getSelectedIndexOptionally(options, selected);

  return (
    <select onChange={onChange} value={selectedIndex}>
      {options.map((option, index) => {
        return <option key={index} value={index} selected={selectedIndex === index}>{option.label}</option>
      })}
    </select>
  );
}