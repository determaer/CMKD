import type { Label } from "../types/label";
import { calcControlPoint } from "./calcControlPoint";
import type { Angle } from "../types/angle";

export const calcLinePoint = (
  objLabelIn: Label,
  objLabelOut: Label,
  angles: Angle[],
  discNum: number,
  scaleMultiplier: number,
  innerRadius: number,
  lineStartRadius: number,
  centerPoint: number,
) => {
  const inAngles = angles.find((lAngle) => lAngle.labelId === objLabelIn.id);
  const outAngles = angles.find((lAngle) => lAngle.labelId === objLabelOut.id);
  if (inAngles == undefined || outAngles == undefined) return [];

  const discNumCorrection = discNum >= 50 ? 1 : 0;

  const diff = Math.abs(outAngles.outAngle - inAngles.inAngle);

  const outAngle =
    outAngles.outAngle >= 300 ? outAngles.outAngle - 360 : outAngles.outAngle;

  const inAngle =
    inAngles.inAngle >= 300 ? inAngles.inAngle - 360 : inAngles.inAngle;

  const bezierCPangle1 =
    diff < 180 ? outAngle + diff / 250 : outAngle - diff / 250;

  const bezierCPangle2 =
    diff < 180 ? inAngle - diff / 250 : inAngle + diff / 250;

  const angleCorrection =
    diff < 180 ? (180 - diff) / 10 : (180 - Math.abs(diff - 360)) / 10;

  const radius =
    (10 * angleCorrection + 50 * discNumCorrection) * scaleMultiplier;

  const [CPX1, CPY1] = calcControlPoint(centerPoint, radius, bezierCPangle1);
  const [CPX2, CPY2] = calcControlPoint(centerPoint, radius, bezierCPangle2);
  const [outX, outY] = calcControlPoint(centerPoint, innerRadius, outAngle);
  const [inX, inY] = calcControlPoint(centerPoint, lineStartRadius, inAngle);

  return [outX, outY, CPX1, CPY1, CPX2, CPY2, inX, inY];
};
