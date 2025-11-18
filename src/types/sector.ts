import type { Label } from "./label";
import { instanceOfLabel } from "./label";

export interface Sector extends SectorLabel {
  sStart: number; // начальный угол
  sEnd: number; // конечный угол
}

export type SObjectLabel = Pick<
  Label,
  "id" | "isLabel" | "numText" | "typeText" | "score" | "fontStyle"
>;

export interface SectorLabel {
  sLevel: number; // уровень
  object: SObjectLabel | Pick<Label, "id">; // объект, описываемый сектором
  shortname?: string; // наименование
}

export function instanceOfSector(sector: unknown): sector is Sector {
  return (
    sector instanceof Object &&
    "sStart" in sector &&
    "sEnd" in sector &&
    "sLevel" in sector &&
    "object" in sector &&
    instanceOfLabel(sector.object)
  );
}

export function isSectorObjectValidForUpperLevelsCMKD(
  object: unknown,
): object is SObjectLabel {
  return (
    object instanceof Object &&
    "id" in object &&
    "isLabel" in object &&
    "numText" in object &&
    "typeText" in object &&
    "score" in object &&
    "fontStyle" in object
  );
}

