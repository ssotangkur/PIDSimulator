import styled from "styled-components";


export const ShortInput = styled.input<{invalid?: boolean}>`
  width: 4rem;
  text-align: end;
  ${props => props.invalid && 'border: solid 2px red;' }
  ${props => props.invalid && 'outline: solid 2px red;' }
`