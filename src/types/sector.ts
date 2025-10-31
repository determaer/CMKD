import type { Label } from "./label";
import { instanceOfLabel } from "./label";

export interface Sector extends SectorLabel {
  sStart: number; // начальный угол
  sEnd: number; // конечный угол
}

export interface SectorLabel {
  sStartLID: number; // id элемента в начале сектора
  sEndLID: number; // id элемента в конце сектора
  sLevel: number; // уровень
  object: Label; // объект, описываемый сектором
  shortname?: string; // наименование
}

export function instanceOfSector(sector: unknown): sector is Sector {
  return (
    sector instanceof Object &&
    "sStart" in sector &&
    "sEnd" in sector &&
    "sStartLID" in sector &&
    "sEndLID" in sector &&
    "sLevel" in sector &&
    "object" in sector &&
    instanceOfLabel(sector.object)
  );
}
