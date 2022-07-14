import styled, { css } from "styled-components";

// Font installed in index.html header
// See https://fonts.google.com/
const Font = css`
  font-family: Quicksand, sans-serif;
`

const Regular = css`
   font-weight: 400;
`
const Bold = css`
  font-weight: 700;
`
const Light = css`
  font-weight: 300;
`

const Title = css`
  font-size: 1.5rem;
`
const Body = css`
  font-size: 1rem;
`
const Caption = css`
  font-size: 0.8rem;
`

export const TitleRegular = styled.span`
  ${Font}
  ${Title}
  ${Regular}
`

export const TitleBold = styled.span`
  ${Font}
  ${Title}
  ${Bold}
`

export const TitleLight = styled.span`
  ${Font}
  ${Title}
  ${Light}
`

export const BodyRegular = styled.span`
  ${Font}
  ${Body}
  ${Regular}
`

export const BodyBold = styled.span`
  ${Font}
  ${Body}
  ${Bold}
`

export const BodyLight = styled.span`
  ${Font}
  ${Body}
  ${Light}
`

export const CaptionRegular = styled.span`
  ${Font}
  ${Caption}
  ${Regular}
`

export const CaptionBold = styled.span`
  ${Font}
  ${Caption}
  ${Bold}
`

export const CaptionLight = styled.span`
  ${Font}
  ${Caption}
  ${Light}
`