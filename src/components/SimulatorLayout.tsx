import styled from "styled-components"
import { ControlChart } from "./charts/ControlChart"
import { ShrinkableHeight, ShrinkableHeightDiv } from "./Layout"
import { SimulationChart } from "./charts/SimulationChart"
import { PIDInput } from "./PIDInput"
import { SetPointInput } from "./SetPointInput"
import { TitleBold } from "./Typography"
import { PIDChart } from "./charts/PIDChart"

const BorderBoxShadowDiv = styled.div`
  border: solid 1px black;
  box-shadow: 8px 8px 6px grey;
`

const InputsContainer = styled(BorderBoxShadowDiv)`
  width: 100%;
  position: relative;
  display: flex;
  flex-basis: content;
  flex-grow: 1;
  ${ShrinkableHeight}
`

const ChartContainer = styled(BorderBoxShadowDiv)`
  width: 100%;
  /* height: 400px; */
  flex-grow: 1;
  flex-basis: 200px;
  margin-bottom: 40px;
`

const Layout = styled(ShrinkableHeightDiv)`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
`

export const Simulator = () => {

  return (
    <Layout>
      <TitleBold>PID Simulator</TitleBold>
      <ChartContainer>
        <SimulationChart/>
      </ChartContainer>
      <ChartContainer>
        <ControlChart/>
      </ChartContainer>
      <ChartContainer>
        <PIDChart/>
      </ChartContainer>
      <InputsContainer>
        <SetPointInput/>
        <PIDInput/>
      </InputsContainer>
    </Layout>
  );
}