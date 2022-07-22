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
}
export const DropDown = ({options}: DropDownProps) => {

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if(value) {
      const optionIndex = parseInt(value);
      options[optionIndex].onSelected();
    }
  }

  return (
    <select onChange={onChange}>
      {options.map((option, index) => {
        return <option key={index} value={1}>{option.label}</option>
      })}
    </select>
  );
}