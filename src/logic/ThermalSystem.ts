/**
 * Model a flat plate heated by electric heater and cooled by natural convection
 * 
 * https://www.sciencedirect.com/topics/engineering/convection-heat-transfer-coefficient
 * 
 * Break up plate into many slices of deltaX thickness. Maintain temp of each slice to
 * calculate the temp in the next iteration.
 * 
 * 1) DeltaPowerCapacity(interiorSlice) = ConductionPower(leftSlice) + ConductionPower(rightSlice)
 * 
 * 2) ConductionPower(slice) = (Area * themalConductivity * TempDiff) / deltaX
 * 
 * Together:
 * 3) deltaPowCap(interior = i) = (A * Kconduct * (T[i-1] - T[i])) / deltaX  + (A * Kconduct * (T[i+1] - T[i])) / deltaX
 * Simplify:
 * 4) deltaPowCap(i) = ((A * Kconduct)/deltaX) * (T[i-1] + T[i+1] - 2T[i])
 * 
 * 5) DeltaPowerCapacity = SpecificHeat * DeltaTemp * Mass / deltaTime
 * 
 * 6) Mass = Area * deltaX * density
 * Together:
 * 7) DeltaPowerCap = (KspecHeat * (T - T[i]) * Area * deltaX * density) / deltaTime
 * From (4) and (7):
 * 8) ((A * Kconduct)/deltaX) * (T[i-1] + T[i+1] - 2T[i]) = (KspecHeat * (T - T[i]) * Area * deltaX * density) / deltaTime
 * Solve for T:
 * 9) T = (Kconduct * deltaT)/(KspecHeat * deltaX^2 * density) * (T[i-1] + T[i+1] - 2T[i]) + T[i];
 * 
 * For start slice, heater power becomes the ConductionPower(leftSlice):
 * 10) DeltaPower(firstSlice = 0) = heaterPower + ConductionPower(rightSlice=1)
 * From 3) and 10) 
 * 11) deltaPowCap(0) = heaterPower + (A * Kconduct * (T[1] - T[0])) / deltaX
 * From 7)
 * 12) (KspecHeat * (T - T[0]) * Area * deltaX * density) / deltaTime = heaterPower + (A * Kconduct * (T[1] - T[0])) / deltaX
 * Solve for T:
 * 13) TfirstSlice = (H + (Area * Kc/deltaX)(T[1] - T[0])) * (deltaTime/(Ks * A * deltaX * density)) + T[0]
 *  
 * Last slice has Convective cooling for right side
 * 14) DeltaPowConv = Hconv * Area(Troom - T[last])
 * Substitute from 3):
 * 15) DeltaPow(last) =  (A * Kconduct * (T[last-1] - T[last])) / deltaX + Hconv * Area *(Troom - T[last])
 * Substitute 7)
 * 16) (KspecHeat * (T - T[last]) * Area * deltaX * density) / deltaTime =  (A * Kconduct * (T[i-1] - T[i])) / deltaX + Hconv * Area *(Troom - T[last])
 * Solve for T:
 * 17) T(last) = (deltaTime/(deltaX^2 * density * KspecHeat)) * (Kconduct * (T[last-1] - T[last])) + deltaX * Hconv * (Troom - T[last]) + T[last];
 * 
 */

import { atom } from "jotai";
import { samplingDurationAtom } from "./PIDSimulator";
import { Plant } from "./Plant";
import { SimulationConfig } from "./Simulation";

export type ThermalConfig = {

  heaterPower: number, // Watts

  convectiveHeatTransfer: number, // W/(m^2*C)
  thermalConductivity: number, // W/(m*C)
  specificHeat: number, // J/(g*C)
  density: number, // g/m^3

  
  roomTemperature: number, // Celcius

  area: number, // m^2
  thickness: number, // m

  divisions: number, // to subdivide

  samplingDuration: number, // seconds
}

export type ThermalState = {
  T: number[], // slice temps
}

export type ThermalSystemPlant = Plant<ThermalConfig, ThermalState>;

export const thermalPlant: ThermalSystemPlant = (
  { heaterPower, convectiveHeatTransfer, area, roomTemperature, specificHeat, density, samplingDuration, thickness, divisions, thermalConductivity }, 
  { T }, 
  control
) => {
  const Power = (control && (control * heaterPower)) ?? 0; // heating power commanded
  const Troom = roomTemperature; // Temp infinity
  const h = convectiveHeatTransfer;
  const K = thermalConductivity;
  const A = area; // Surface area
  const Cp = specificHeat;
  const P = density;

  const deltaX = thickness / divisions;
  const deltaTime = samplingDuration / divisions;

  const alpha = K/(P * Cp);

  for(let times=0; times<divisions; times++) {
    const Tnew = new Array(divisions);
    for(let i=0; i<divisions;i++) {
      let dEdtLeft;
      let dEdtRight;
      let dEdt;
      if(i === 0) {
        // TfirstSlice = (H + (Area * Kc/deltaX)(T[1] - T[0])) * (deltaTime/(Ks * A * deltaX * density)) + T[0]
        dEdtLeft = Power;
        dEdtRight = alpha * (T[1] - T[0]) / Math.pow(deltaX, 2);
        // Tnew[i] = (Power + ((A * K)/deltaX) * (T[1] - T[0])) * (deltaTime/ (Cp * A * deltaX * P)) + T[i];
      } else if(i === (divisions-1)) {
        // T(last) = (deltaTime/(deltaX^2 * density * KspecHeat)) * (Kconduct * (T[last-1] - T[last])) + deltaX * Hconv * (Troom - T[last]) + T[last];
        dEdtLeft = alpha * (T[i-1] - T[i]) / Math.pow(deltaX, 2);
        dEdtRight = h * A * (Troom - T[i]);
        // Tnew[i] = (deltaTime/(Math.pow(deltaX,2) * P * Cp)) * (K * (T[i-1] - T[i])) + deltaX * h * (Troom - T[i]) + T[i];
      } else {
        dEdtLeft = alpha * (T[i-1] - T[i]) / Math.pow(deltaX, 2);
        dEdtRight = alpha * (T[i+1] - T[i]) / Math.pow(deltaX, 2);
        // T = (Kconduct * deltaT)/(KspecHeat * deltaX^2 * density) * (T[i-1] + T[i+1] - 2T[i]) + T[i];
        // Tnew[i] = (K * deltaTime)/(Cp * Math.pow(deltaX,2) * P) * (T[i-1] + T[i+1] - 2 * T[i]) + T[i];
      }
      dEdt = dEdtLeft + dEdtRight;
      Tnew[i] = T[i] + (dEdt/(deltaX * A * P * Cp)) * deltaTime;
    }
    Tnew.forEach((t, i) => T[i] = t);
  }

  return {
    measurement: T[T.length-1],
    state: { T },
  }
}

const heaterPowerAtom = atom(750);
const heatTransferCoeffAtom = atom(2.5);
const thermalConductivityAtom = atom(239);
const densityAtom = atom(2700000);
const thicknessAtom = atom(0.005);
const divisionsAtom = atom(5);
const areaAtom = atom(0.3 * 0.3);
const roomTempAtom = atom(0);
const specificHeatAtom = atom(0.897);

export const thermalSystemSimulation: SimulationConfig<ThermalConfig, ThermalState> = {
  plant: thermalPlant,
  uiConfig: {
    title: "Heated Bed System",
    inputAtoms: [
      {
        label: "Heater Power (W)",
        atom: heaterPowerAtom,
      },
      {
        label: "Heat Transfer Coeff (W/(m^2*C))",
        atom: heatTransferCoeffAtom,
      },
      {
        label: "Thermal conductivity (W/(m*C))",
        atom: thermalConductivityAtom,
      },
      {
        label: "Specific Heat (Joule/(g * C))",
        atom: specificHeatAtom,
      },
      {
        label: "Density (g/m^3)",
        atom: densityAtom,
      },
      {
        label: "Thickness (m)",
        atom: thicknessAtom,
      },
      {
        label: "Area (m^2)",
        atom: areaAtom,
      },
      {
        label: "Room Temp (C)",
        atom: roomTempAtom,
      },
      {
        label: "Divisions",
        atom: divisionsAtom,
      },
    ]
  },
  configSupplier: (get) => {
    return {
      heaterPower: get(heaterPowerAtom),
      convectiveHeatTransfer: get(heatTransferCoeffAtom),
      thermalConductivity: get(thermalConductivityAtom),
      specificHeat: get(specificHeatAtom),
      density: get(densityAtom),
      roomTemperature: get(roomTempAtom),
      area: get(areaAtom),
      thickness: get(thicknessAtom),
      divisions: get(divisionsAtom),
      samplingDuration: get(samplingDurationAtom),
    }
  },
  initialStateSupplier: (get) => ({
    T: new Array(get(divisionsAtom)).fill(get(roomTempAtom)),
  }),
}