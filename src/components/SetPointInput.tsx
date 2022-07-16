import { atom, useAtom } from "jotai"
import { useCallback, useRef } from "react";
import styled from "styled-components";
import { ShrinkableHeightDiv, SpacingHorizontal } from "./Layout";
import { BodyRegular, TitleBold } from "./Typography";

export const setPointsAtom = atom([
  0,
  2,
  3,
  4,
  5,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  10, 
  10, 
  10,
  10,
  10,
  8,
  5,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
]);

const TableViewport = styled(ShrinkableHeightDiv)`
  display: flex;
  border: solid 1px black;
  max-height: 400px;
  min-height: 0;
  overflow-y: scroll;
  width: fit-content;
  min-width: 120px;
  align-self: flex-end;
  height: 100%;
`

const Wrapper = styled(ShrinkableHeightDiv)`
  display: flex;
  flex-direction: column;
  width: fit-content;
  border: solid 1px black;
  padding: 1rem;
`

const TableRow  = styled.tr<{rowNumber: number}>`
  background-color: ${props => props.rowNumber % 2 ? 'white': 'lightgrey'};
`

const ExpandingCell = styled.td`
  width: 100%;
`

const DivRow = styled(ShrinkableHeightDiv)`
  flex-direction: row;
  ${SpacingHorizontal}
`

const DivColumn = styled(ShrinkableHeightDiv)`
  flex-direction: column;
  align-items: flex-start;
`

const Input = styled.input`
  width: 5rem;
`

export const SetPointInput = () => {

  const [setPoints, setSetPoints] = useAtom(setPointsAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const incrementPoint = useCallback((index: number) => {
    setSetPoints((prev) => {
      const next = [...prev];
      next[index]++;
      return next;
    });
  }, [setSetPoints]);

  const decrementPoint = useCallback((index: number) => {
    setSetPoints((prev) => {
      const next = [...prev];
      next[index]--;
      return next;
    });
  }, [setSetPoints]);

  const addSetPoint = useCallback(() => {
    if(inputRef.current?.value) {
      setSetPoints((prev) => {
        const newSetPoint = parseInt(inputRef.current?.value ?? '');
        if(isNaN(newSetPoint)) {
          return prev;
        }
        const next = [...prev];
        next.push(newSetPoint);
        return next;
      });
    }
  }, [setSetPoints]);

  return (
    <Wrapper>
      <TitleBold>Set Points</TitleBold>
      <DivRow>
        <DivColumn>
          <BodyRegular>Add Set Point:</BodyRegular>
          <Input placeholder="Enter value" ref={inputRef}></Input>
          <button onClick={addSetPoint}>Add</button>
        </DivColumn>
        <TableViewport>
          <table>
            <tbody>
              {setPoints.map((sp, rowNumber) => (
                <TableRow rowNumber={rowNumber} key={rowNumber}>
                  <ExpandingCell><BodyRegular>{sp}</BodyRegular></ExpandingCell>
                  <td><button onClick={() => incrementPoint(rowNumber)}><BodyRegular>+</BodyRegular></button></td>
                  <td><button onClick={() => decrementPoint(rowNumber)}><BodyRegular>-</BodyRegular></button></td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </TableViewport>
      </DivRow>
    </Wrapper>
  )
}