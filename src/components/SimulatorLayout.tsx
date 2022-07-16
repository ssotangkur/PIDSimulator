import styled from "styled-components"
import { ControlChart } from "./charts/ControlChart"
import { ShrinkableHeight, ShrinkableHeightDiv } from "./Layout"
import { SimulationChart } from "./charts/SimulationChart"
import { PIDInput } from "./inputs/PIDInput"
import { SetPointInput } from "./inputs/SetPointInput"
import { TitleBold } from "./Typography"
import { PIDChart } from "./charts/PIDChart"
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex"

const BorderBoxShadowDiv = styled.div`
  border: solid 1px black;
  box-shadow: 8px 8px 6px grey;
`

const InputsContainer = styled.div`
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
  flex-shrink: 1;
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
  padding: 1rem;
`

export const Simulator = () => {

  return (
    <Layout>
      <ReflexContainer orientation="horizontal" style={{height: "100%"}}>
        <ReflexElement>
          <TitleBold>PID Simulator</TitleBold>
        </ReflexElement>
        <ReflexElement flex={1} propagateDimensions={true} className="noscroll">
          <SimulationChart/>
        </ReflexElement>
        <ReflexSplitter propagate={false} />
        <ReflexElement flex={1} propagateDimensions={true} className="noscroll">
          <ControlChart/>
        </ReflexElement>
        <ReflexSplitter propagate={false} />
        <ReflexElement flex={1} propagateDimensions={true} className="noscroll">
          <PIDChart/>
        </ReflexElement>
        <ReflexSplitter propagate={false} />
        <ReflexElement flex={1}  className="noscroll">
          <InputsContainer>
            <SetPointInput/>
            <PIDInput/>
          </InputsContainer>
        </ReflexElement>
      </ReflexContainer>
    </Layout>
  );
}