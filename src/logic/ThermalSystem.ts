/**
 * Model a flat plate heated by electric heater and cooled by natural convection
 * 
 * https://www.sciencedirect.com/topics/engineering/convection-heat-transfer-coefficient
 * 
 * Newton's Law of cooling
 * Qconv = HeatTransferCoeff * SurfaceArea * (RoomTemp - PlateTemp)
 * 
 * Qheating = Mass * SpecificHeatCoeff * TempChange
 */

import { Plant } from "./Plant";

export type ThermalConfig = {

  heaterPower: number, // Watts

  heatTransferCoeff: number, // W/(m^2*C)
  area: number, // m^2
  roomTemperature: number, // Celcius

  specificHeatCoeff: number, // J/(g*C)
  mass: number, // g

  samplingDuration: number, // seconds
}

export type ThermalState = {
  prevTemp: number,
}

export type ThermalSystemPlant = Plant<ThermalConfig, ThermalState>;

export const thermalPlant: ThermalSystemPlant = (
  { heaterPower, heatTransferCoeff, area, roomTemperature, specificHeatCoeff, mass, samplingDuration }, 
  { prevTemp }, 
  control
) => {
  const Power = (control && (control * heaterPower)) ?? 0; // heating power commanded
  const dT = samplingDuration; // delta time
  const Tinf = roomTemperature; // Temp infinity
  const h = heatTransferCoeff;
  const S = area; // Surface area
  const Cp = specificHeatCoeff;
  const m = mass;
  const Tprev = prevTemp;

  const T = ((dT * Tinf * S * h) + (m * Cp * Tprev) + (dT * Power)) /
    ((m * Cp) + (dT * S * h));

  return {
    measurement: T,
    state: {
      prevTemp: T,
    }
  }
}