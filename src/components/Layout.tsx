import styled, { css } from "styled-components";

export const Shrinkable = css`
  display: flex;
  flex-shrink: 1;
`
export const ShrinkableHeight = css`
  ${Shrinkable}
  min-height: 0;
`
export const ShrinkableWidth = css`
  ${Shrinkable}
  min-width: 0;
`
export const ShrinkableHeightDiv = styled.div`
  ${ShrinkableHeight}
`
export const SpacingHorizontal = css<{spacing?: string}>`
  & > *:not(:last-child) {
    margin-right: ${props => props.spacing ?? '1rem'};
  }
`
export const SpacingVertical = css<{spacing?: string}>`
  & > *:not(:last-of-type) {
    margin-bottom: ${props => props.spacing ?? '1rem'};
  }
`

export const Page = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 2rem;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  ${SpacingHorizontal}
`